"""

Atnotate Documentation Generator v1.0.0
(c) 2012 Mutual Mobile
Released under the MIT license.

"""

import getopt
import json
import os
import re
import shutil
import sys
from operator import attrgetter

class DocItem(object):
    desc = ''
    is_private = False
    author = None
    is_deprecated = False
    see = None
    examples = None
    def __init__(self, desc):
        self.desc = desc
        self.see = []
        self.examples = []
    def __repr__(self):
        return self.desc
    def to_dict(self):
        result = {}
        if self.desc:
            result['desc'] = self.desc
        if self.is_private:
            result['private'] = True
        if self.is_deprecated:
            result['deprecated'] = True
        if self.see:
            result['see'] = self.see
        if self.examples:
            result['examples'] = self.examples
        return result
    def json(self):
        return json.dumps(self.to_dict())

class DocType(DocItem):
    ns = None
    name = None
    fields = None
    methods = None
    constructor = None
    super_type = None
    def __init__(self, ns, name, desc):
        super(DocType, self).__init__(desc)
        self.fields = []
        self.methods = []
        self.ns = ns
        self.name = name
    def qualified_name(self):
        if self.ns:
            return '%s.%s' % (self.ns, self.name)
        else:
            return self.name
    def url(self):
        return '%s.html' % self.qualified_name()
    def scrape(self, text):
        return re.sub('\[\[(.+?)\]\]', '<a href="\\1.html">\\1</a>', text)
    def scrape_type(self, kind):
        if re.match(r'\w+(\.\w+)+', kind):
            return '<a href="%s.html">%s</a>' % (kind, kind)
        else:
            return kind
    def to_dict(self):
        result = super(DocType, self).to_dict()
        if self.ns:
            result['ns'] = self.ns
        if self.name:
            result['name'] = self.name
        result['qualifiedName'] = self.qualified_name()
        static_fields = dict([(f.name, f) for f in filter(lambda x: x.is_static and not x.is_private, self.fields)])
        static_methods = dict([(f.name, f) for f in filter(lambda x: x.is_static and not x.is_private, self.methods)])
        fields = dict([(f.name, f) for f in filter(lambda x: not x.is_static and not x.is_private, self.fields)])
        methods = dict([(f.name, f) for f in filter(lambda x: not x.is_static and not x.is_private, self.methods)])
        super_type = self.super_type
        while super_type and isinstance(super_type, DocType):
            if super_type.methods:
                fields.update(dict([(f.name, f) for f in filter(lambda x: not x.name in fields and not x.is_static and not x.is_private, super_type.fields)]))
                methods.update(dict([(f.name, f) for f in filter(lambda x: not x.name in methods and not x.is_static and not x.is_private, super_type.methods)]))
            super_type = super_type.super_type
        result['staticFields'] = [static_fields[k].to_dict() for k in sorted(static_fields.keys())]
        result['staticMethods'] = [static_methods[k].to_dict() for k in sorted(static_methods.keys())]
        result['fields'] = [fields[k].to_dict() for k in sorted(fields.keys())]
        result['methods'] = [methods[k].to_dict() for k in sorted(methods.keys())]
        for f in filter(lambda v: 'owner' in v and v['owner'] != self.qualified_name(), result['fields']):
            f['inherited'] = True
        for f in filter(lambda v: 'owner' in v and v['owner'] != self.qualified_name(), result['methods']):
            f['inherited'] = True
        if self.constructor:
            result['constructor'] = self.constructor.to_dict()
        if self.super_type:
            super_type = self.super_type
            inheritance = []
            while super_type:
                if isinstance(super_type, DocType):
                    inheritance.append(super_type.qualified_name())
                    super_type = super_type.super_type
                else:
                    inheritance.append(super_type)
                    super_type = None
            result['inheritance'] = inheritance
            if isinstance(self.super_type, DocType):
                result['superType'] = self.super_type.qualified_name()
            else:
                result['superType'] = self.super_type
        return result
    def __repr__(self):
        return '<%s>' % self.qualified_name()

class DocTypedItem(DocItem):
    kind = None
    def __init__(self, kind, desc):
        super(DocTypedItem, self).__init__(desc)
        self.kind = kind
    def to_dict(self):
        result = super(DocTypedItem, self).to_dict()
        if self.kind:
            result['type'] = self.kind
        return result

class DocField(DocTypedItem):
    name = None
    default = None
    opts = None
    is_static = False
    owner = None
    def __init__(self, name, kind, desc, owner=None):
        super(DocField, self).__init__(kind, desc)
        self.name = name
        self.opts = []
        self.owner = owner
    def to_dict(self):
        result = super(DocField, self).to_dict()
        if self.name:
            result['name'] = self.name
        if self.default:
            result['default'] = self.default
        if self.opts:
            result['opts'] = [o.to_dict() for o in sorted(self.opts, key=attrgetter('name'))]
        if self.is_static:
            result['static'] = self.is_static
        if self.owner:
            result['owner'] = self.owner
        return result

class DocMultilengthField(DocField):
    def __init__(self, name, kind, desc):
        super(DocMultilengthField, self).__init__(name, kind, desc)
    def to_dict(self):
        result = super(DocMultilengthField, self).to_dict()
        result['multilength'] = True
        return result

class DocSignature(DocItem):
    params = None
    returnValue = None
    def __init__(self, desc):
        super(DocSignature, self).__init__(desc)
        self.params = []
    def to_dict(self):
        result = super(DocSignature, self).to_dict()
        if self.params:
            result['params'] = [p.to_dict() for p in self.params]
        if self.returnValue:
            result['returnValue'] = self.returnValue.to_dict()
        return result

class DocMethod(DocField):
    signatures = None
    owner = None
    def __init__(self, owner, name):
        super(DocMethod, self).__init__(name, None, None)
        self.signatures = []
        if owner:
            self.owner = owner.qualified_name()
    def clone(self, name):
        result = DocMethod(None, name)
        result.default = self.default
        result.opts.extend(self.opts)
        result.signatures.extend(self.signatures)
        result.is_static = self.is_static
        result.owner = self.owner
        result.kind = self.kind
        result.is_private = self.is_private
        result.author = self.author
        result.is_deprecated = self.is_deprecated
        result.see.extend(self.see)
        result.examples.extend(self.examples)
        return result
    def get_name(self, sig):
        result = self.name + '('
        is_first = True
        for param in sig.params:
            if is_first:
                is_first = False
            else:
                result += ', '
            if isinstance(param, DocMultilengthField):
                result += '%(name)s0, %(name)s1, ... %(name)sN' % {'name': param.name}
            else:
                result += param.name
        return result + ')'
    def get_id(self, sig):
        result = self.name + '('
        is_first = True
        for param in sig.params:
            if is_first:
                is_first = False
            else:
                result += ','
            if isinstance(param, DocMultilengthField):
                result += '**' + param.kind
            else:
                result += param.kind
        return result + ')'
    def get_signatures(self):
        if not self.signatures:
            self.signatures.append(DocSignature(self.desc))
        return self.signatures
    def to_dict(self):
        result = super(DocMethod, self).to_dict()
        if self.signatures:
            sig_dicts = []
            for signature in self.signatures:
                sig_dict = signature.to_dict()
                sig_dict['id'] = self.get_id(signature)
                sig_dict['name'] = self.get_name(signature)
                sig_dicts.append(sig_dict)
            result['signatures'] = sig_dicts
        if self.owner:
            result['owner'] = self.owner
        return result

class DocWriter(object):
    def __init__(self, templates):
        self.templates_folder = templates
    def error(self, index, path, msg):
        print 'Error: {0} at line {1} of {2}'.format(msg, index, path)
        raise Exception(('File %s contains malformed Doc comments: ' % path) + msg)
    def scrub(self, tag, line):
        return line.replace(tag, '').strip()
    def scrub_type(self, line):
        return line.lstrip('{').rstrip('}')
    def parse_field(self, tag, line, has_name=True, field_type=DocField, owner=None):
        if tag == '@return':
            has_name = False
        elif tag == '@param' and line.startswith('@params'):
            tag = '@params'
            field_type = DocMultilengthField
        line = self.scrub(tag, line).split(' ')
        kind = self.scrub_type(line[0])
        name = None
        desc = None
        if has_name:
            name = line[1]
            desc = line[2:]
        else:
            desc = line[1:]
        field = field_type(name, kind, ' '.join(desc))
        if owner:
            field.owner = owner.qualified_name()
        return field
    def process_file(self, path):
        types = []
        current_type = None
        current_field = None
        current_method = None
        current_sig = None
        current_param = None
        current_item = None
        is_in_block = False
        f = open(path, 'r')
        for index, line in enumerate(f.readlines()):
            line = line.strip()
            if line.startswith('/**'):
                is_in_block = True
            elif is_in_block and line.startswith('*/'):
                is_in_block = False
                current_field = current_method = current_sig = current_param = current_item = None
            elif is_in_block:
                line = re.sub('[\s\*]+', ' ', line).lstrip()
                if line.startswith('@class'):
                    line = self.scrub('@class', line).split('.')
                    name = line[-1]
                    ns = '.'.join(line[:-1])
                    current_type = DocType(ns, name, None)
                    current_item = current_type
                    types.append(current_type)
                elif not current_type:
                    self.error(index, path, 'Doc comment exists outside of @class')
                    return types
                elif line.startswith('@desc'):
                    current_type.desc = self.scrub('@desc', line)
                elif line.startswith('@super'):
                    line = self.scrub('@super', line)
                    current_type.super_type = line
                elif line.startswith('@constructor'):
                    current_method = current_sig = current_param = current_field = None
                    if not current_type.constructor:
                        current_type.constructor = DocMethod(current_type, current_type.name)
                    current_method = current_type.constructor
                    current_sig = DocSignature('Constructor')
                    current_method.signatures.append(current_sig)
                    current_item = current_sig
                elif line.startswith('@field'):
                    current_method = current_sig = current_param = current_field = None
                    current_field = self.parse_field('@field', line, owner=current_type)
                    current_type.fields.append(current_field)
                    current_item = current_field
                elif line.startswith('@default'):
                    if not current_field:
                        self.error(index, path, '@default exists outside of @field')
                    current_field.default = self.scrub('@default', line)
                elif line.startswith('@method'):
                    current_method = current_sig = current_param = current_field = None
                    current_method = DocMethod(current_type, self.scrub('@method', line))
                    current_type.methods.append(current_method)
                    current_item = current_method
                elif line.startswith('@static'):
                    current_item.is_static = True
                elif line.startswith('@sig'):
                    current_sig = current_param = None
                    if not current_method:
                        self.error(index, path, '@sig exists outside of @method')
                    current_sig = DocSignature(self.scrub('@sig', line))
                    current_method.signatures.append(current_sig)
                    current_item = current_sig
                elif line.startswith('@param'):
                    if not current_sig:
                        current_sig = DocSignature(None)
                        current_method.signatures.append(current_sig)
                    current_param = self.parse_field('@param', line)
                    current_sig.params.append(current_param)
                    current_item = current_param
                elif line.startswith('@opt'):
                    if not current_param:
                        self.error(index, path, '@opt exists outside of @param')
                    current_field = self.parse_field('@opt', line)
                    current_param.opts.append(current_field)
                    current_item = current_field
                elif line.startswith('@return'):
                    current_param = current_field = None
                    if not current_sig:
                        current_sig = DocSignature(None)
                        current_method.signatures.append(current_sig)
                    current_sig.returnValue = self.parse_field('@return', line)
                    current_item = current_sig.returnValue
                elif line.startswith('@event'):
                    pass
                elif line.startswith('@private'):
                    if not current_item:
                        self.error(index, path, '@private exists outside of item')
                    current_item.is_private = True
                elif line.startswith('@see'):
                    if not current_item:
                        self.error(index, path, '@see exists outside of item')
                    current_item.see.append(self.scrub('@see', line))
                elif line.startswith('@deprecated'):
                    if not current_item:
                        self.error(index, path, '@deprecated exists outside of item')
                    current_item.is_deprecated = True
                elif current_item:
                    line = line.lstrip()
                    if line:
                        if not current_item.desc:
                            current_item.desc = ''
                        current_item.desc += ' ' + line
        f.close()
        for t in types:
            t.fields = sorted(t.fields, key=attrgetter('name'))
            t.methods = sorted(t.methods, key=attrgetter('name'))
            for method in filter(lambda m: len(m.signatures) < 1, t.methods):
                method.signatures.append(DocSignature(method.desc))
        return types
    def load_types(self, path, exclude, ext='.js'):
        types = {}
        ns = {}
        for r, d, f in os.walk(path):
            for files in filter(lambda x: x.endswith(ext) and not any(x in s for s in exclude), f):
                p = os.path.join(r, files)
                types.update(dict([(t.qualified_name(), t) for t in self.process_file(p)]))
        for t in filter(lambda t: t.super_type and t.super_type in types and not t.constructor, types.values()):
            super_type = types[t.super_type]
            constructor = super_type.constructor
            while not constructor and super_type and super_type in types:
                super_type = types[super_type]
                constructor = super_type.constructor
            if constructor:
                t.constructor = constructor.clone(t.name)
        return types
    def read(self, path):
        f = open(path, 'r')
        data = f.read()
        f.close()
        return data
    def write(self, out_path, data):
        f = open(out_path, 'w')
        f.write(data)
        f.close()
    def process_dir(self, path, out_dir, write_json=False, write_html=True, ext='.js', exclude=[]):
        ns = {}
        out_dir = os.path.abspath(out_dir)
        if os.path.exists(out_dir):
            shutil.rmtree(out_dir)
        os.makedirs(out_dir)
        types = self.load_types(path, exclude, ext=ext,)
        shutil.copytree(os.path.join(self.templates_folder, 'assets'), os.path.join(out_dir, 'assets'))
        docs_dir = out_dir
        if not os.path.exists(docs_dir):
            os.makedirs(docs_dir)
        template = self.read(os.path.join(self.templates_folder, 'type.html'))
        for k, t in types.items():
            if not t.ns:
                ns[t.name] = [t]
            elif not t.ns in ns:
                ns[t.ns] = [t]
            else:
                ns[t.ns].append(t)
            if t.super_type and t.super_type in types:
                t.super_type = types[t.super_type]
        for k, t in types.items():
            data = t.json()
            data = re.sub('\[\[(.+?)\]\]', r'<a href=\"\1.html\" target=\"_top\">\1</a>', data)
            if write_html:
                self.write(os.path.join(docs_dir, '%s.html' % k), template.replace('[[title]]', t.name).replace('[[description]]', t.desc).replace('[[body]]', data))
            if write_json:
                self.write(os.path.join(docs_dir, '%s.json' % k), data)
        ns_list = []
        types_list = types.keys()
        types_list.sort()
        body = ['<h1>Types</h1>', '<ul>']
        for t in types_list:
            t = types[t]
            if not t.ns:
                ns_list.append(t.name)
            elif not t.ns in ns_list:
                ns_list.append(t.ns)
            body.append('<li><a href="%s">%s</a></li>' % (t.url(), t.qualified_name()))
        body.append('</ul>')
        template = self.read(os.path.join(self.templates_folder, 'page.html'))
        packages_body = ['<h1>Packages</h1>', '<ul>']
        ns_list.sort()
        for k in ns_list:
            ts = list(t.qualified_name() for t in ns[k])
            ts.sort()
            packages_body.append('<li class="package">%s<ul class="package-contents">' % k)
            for t in ts:
                t = types[t]
                packages_body.append('<li><a href="%s" target="_top">%s</a></li>' % (t.url(), t.name))
            packages_body.append('</ul></li>')
        packages_body.append('</ul>')
        data = template.replace('[[title]]', 'Packages').replace('[[description]]', 'Packages list').replace('[[body]]', '\n'.join(packages_body)).replace('[[bodyClassName]]', 'package-list')
        self.write(os.path.join(docs_dir, 'packages.html'), data)
        template = self.read(os.path.join(self.templates_folder, 'index.html'))
        self.write(os.path.join(out_dir, 'index.html'), template.replace('[[docs]]', 'types'))

def usage():
    print 'Mutual Mobile Atnotate Documentation Generator'
    print 'Usage:'
    print '-h, --help: Show options'
    print '-s, --src: Source directory'
    print '-d, --dst: Destination directory'
    print '-t, --templates: Document templates folder'
    print '-x, --ext: Script file extension'
    print '-m, --html: Generate HTML files'
    print '-j, --json: Generate JSON files'
    print '-e, --exclude: A list of comma-delimited filenames to exclude'

if __name__ == '__main__':
    try:
        opts, args = getopt.getopt(sys.argv[1:], 'hs:d:t:x:h:j:e:', ['help', 'src', 'dst', 'templates', 'ext', 'html', 'json', 'exclude'])
    except getopt.GetoptError, err:
        print str(err)
        usage()
        sys.exit(2)
    src = '../../src'
    dst = '../../docs'
    templates = 'templates'
    ext = '.js'
    write_json = False
    write_html = True
    exclude = []
    for o, a in opts:
        if o in ('-h', '--help'):
            usage()
            sys.exit(1)
        elif o in ('-s', '--src'):
            src = a
        elif o in ('-d', '--dst'):
            dst = a
        elif o in ('-t', '--templates'):
            templates = a
        elif o in ('-x', '--ext'):
            ext = a
        elif o in ('-m', '--html'):
            write_html = a.lower() == 'true'
        elif o in ('-j', '--json'):
            write_json = a.lower() == 'true'
        elif o in ('-e', '--exclude'):
            exclude = a.split(',')
    DocWriter(templates).process_dir(src, dst, write_json=write_json, write_html=write_html, ext=ext, exclude=exclude)
