/*
x-dust 0.5.1

Copyright (c) 2012 Dan Nichols

Released under the MIT license.

dust.js 0.3.0

Copyright (c) 2010 Aleksander Williams

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

 */
(function() {

var BREAK = false,
    UNDEFINED,
    OPERATORS = ['~', '#', '?', '@', ':', '<', '>', '+', '/', '^'],
    OPERATORS_WITH_BODY = ['#', '?', '@', ':', '+', '<'],
    dust;

function _hasProp(obj, name) {
  return obj.hasOwnProperty(name);
}

function _isInstance(obj, T) {
  return obj instanceof T;
}

function _isObject(obj) {
  return typeof obj == 'object' && !_isInstance(obj, Array);
}

function _updateDict(dst, src) {
  if (src) {
    for (var name in src) {
      dst[name] = src[name];
    }
  }
  return dst;
}

function _startsWith(str, seq) {
  return str.indexOf(seq) == 0;
}

function _endsWith(str, seq) {
  return str.slice(-seq.length) == seq;
}

function _each(list, fn, thisp) {
  for (var i = 0, j = list.length; i < j; i++) {
    if (fn.call(thisp, i, list[i]) === BREAK) {
      break;
    }
  }
}

function _contains(list, item) {
  if (list.indexOf) {
    return list.indexOf(item) > -1;
  } else {
    for (var i = 0, j = list.length; i < j; i++) {
      if (list[i] == item) {
        return true;
      }
    }
  }
  return false;
}

function _stringify(o) {
  if (o === UNDEFINED) {
    return 'null';
  } else if (o === UNDEFINED || o === null || typeof o == 'number' || typeof o == 'string' || _isInstance(o, Date)) {
    return JSON.stringify(o);
  } else if (_isInstance(o, XDustNode)) {
    return o.toJSON();
  } else if (_isInstance(o, Array)) {
    var result = ['['],
        j = o.length - 1;
    _each(o, function(i, item) {
      result.push(_stringify(item));
      if (i < j) {
        result.push(',');
      }
    });
    result.push(']');
    return result.join('');
  } else {
    var result = ['{'],
        hadKeys = false,
        n;
    for (n in o) {
      result.push('"', dust.escapeJS(n), '":', _stringify(o[n]), ',');
      hadKeys = true;
    }
    if (hadKeys) {
      result.pop();
    }
    result.push('}');
    return result.join('');
  }
}

function _extend(TSuper, TSub, overrides) {
  if (!overrides) {
    overrides = TSub;
    TSub = TSuper;
    TSuper = {};
  }
  function ctor() {}
  ctor.prototype = TSuper.prototype;
  TSub.prototype = new ctor;
  if (overrides) {
    for (var prop in overrides) {
      TSub.prototype[prop] = overrides[prop];
    }
  }
  return TSub;
}

var XDustContext = _extend(function(head, tail, params) {
    this.head = head;
    this.tail = {};
    this.tailIsValue = !_isObject(tail);
    this.params = _updateDict({}, params);
    this.update(tail);
  }, {
    get: function(name) {
      if (!this.tailIsValue && _hasProp(this.tail, name)) {
        return this.tail[name];
      } else if (_hasProp(this.params, name)) {
        return this.params[name];
      } else if (this.head) {
        return this.head.get(name);
      } else {
        return UNDEFINED;
      }
    },
    set: function(name, value) {
      if (this.tailIsValue) {
        throw 'Cannot get property on value type';
      } else {
        this.tail[name] = value;
      }
    },
    update: function(other) {
      if (other !== UNDEFINED) {
        if (_isInstance(other, XDustContext)) {
          this.tailIsValue = other.tailIsValue;
          if (other.tailIsValue) {
            this.tail = other.tail;
          } else {
            if (this.tailIsValue) {
              this.tail = {};
              this.tailIsValue = false;
            }
            _updateDict(this.tail, other.tail);
          }
          _updateDict(this.params, other.params);
        } else if (_isObject(other)) {
          if (this.tailIsValue) {
            this.tail = {};
            this.tailIsValue = false;
          }
          for (var name in other) {
            this.set(name, other[name]);
          }
        } else {
          this.tailIsValue = true;
          this.tail = other;
        }
      }
    }
  }),
  XDustContextResolver = _extend(function(path) {
    if (_isInstance(path, Array)) {
      path = path.join('.');  
    }
    if (_startsWith(path, '.')) {
      this.path = ['.'].concat(path.slice(1).split('.'));
    } else {
      this.path = path.split('.');
    }
  }, {
    resolve: function(context, model) {
      var copy = new XDustContext(context, model, UNDEFINED);
      if (model) {
        if (_isInstance(model, Array)) {
          copy = [].concat(model);
        } else {
          _each(this.path, function(i, segment) {
            if (segment) {
              if (segment == '.') {
                if (copy.tailIsValue) {
                  copy = copy.tail;
                  return BREAK;
                } else {
                  copy.parent = UNDEFINED;
                }
              } else {
                var value = copy.get(segment);
                if (value !== UNDEFINED) {
                  copy = new XDustContext(copy, value, UNDEFINED);
                  if (copy.tailIsValue) {
                    copy = copy.tail;
                  }
                } else {
                  copy = UNDEFINED;
                  return BREAK;
                }
              }
            } else {
              copy = copy.tail;
              return BREAK;
            }
          }, this);
        }
      } else {
        copy = UNDEFINED;
      }
      return copy;
    }/*,
    toJSON: function() {
      return _stringify(this.path.join('.'));
    }*/
  }),
  XDustRenderChain = _extend(function(head, tail) {
    this.tail = tail;
    this.head = head;
  }, {
    getBlock: function(name) {
      var block = this.tail.getBlock(name);
      if (block) {
        return block;
      } else if (this.head) {
        return this.head.getBlock(name);
      } else {
        return UNDEFINED;
      }
    }
  }),
  XDustNode = _extend(function(blocks) {
    this.blocks = blocks || {};
  }, {
    render: function(chain, context, model) {
      throw 'Abstract';
    },
    getBlock: function(name) {
      if (this.hasBlock(name)) {
        return this.blocks[name].asBlock();
      } else {
        return UNDEFINED;
      }
    },
    setBlock: function(name, value) {
      this.blocks[name] = value;
    },
    hasBlock: function(name) {
      return this.blocks[name] !== UNDEFINED;
    },
    asBlock: function() {
      return this;
    }/*,
    toJSON: function() {
      throw 'Abstract';
    }*/
  }),
  XDustNodeList = _extend(XDustNode, function(blocks, nodes) {
    XDustNode.call(this, blocks, nodes);
    this.nodes = [].concat(nodes || []);
  }, {
    each: function(fn, thisp) {
      _each(this.nodes, fn, thisp || this);
    },
    add: function(node) {
      this.nodes[this.nodes.length] = node;
    },
    last: function() {
      return this.nodes[this.nodes.length - 1];
    },
    prepareModel: function(chain, context, model) {
      return new XDustContext(context, model, UNDEFINED);
    },
    render: function(chain, context, model) {
      chain = new XDustRenderChain(chain, this);
      model = this.prepareModel(chain, context, model);
      var sb = [];
      if (model !== UNDEFINED) {
        this.each(function(i, node) {
          sb[sb.length] = node.render(chain, context, model);
        });
      }
      return sb.join('');
    }/*,
    toJSON: function() {
      var result = [this.alias, '(['],
          i,
          j,
          node;
      for (i = 0, j = this.nodes.length; i < j; i++) {
        node = this.nodes[i];
        result.push(node.toJSON(), ',');
      }
      result.pop();
      result.push('])');
      return result.join('');
    }*/
  }),
  XDustTextNode = _extend(XDustNode, function(value, blocks) {
    XDustNode.call(this, blocks);
    value = value || '';
    this.buffer = [value];
    this.value = value;
  }, {
    write: function(value) {
      if (this.buffer) {
        this.buffer.push(value);
      } else {
        throw 'TextNode buffer is closed';
      }
    },
    close: function() {
      if (this.buffer) {
        this.value = this.buffer.join('');
        this.buffer = UNDEFINED;
      }
    },
    render: function(chain, context, model) {
      this.close();
      return this.value;
    }/*,
    toJSON: function() {
      return [this.alias, '(', _stringify(this.render()), ')'].join('');
    }*/
  }),
  XDustVariableNode = _extend(XDustNode, function(path, blocks, filters) {
    XDustNode.call(this, blocks);
    this.context = new XDustContextResolver(path);
    this.filters = [].concat(filters || []);
  }, {
    render: function(chain, context, model) {
      chain = new XDustRenderChain(chain, this);
      var origModel = model,
          result = '',
          flag;
      model = this.context.resolve(context, model);
      if (model !== UNDEFINED) {
        if (_isInstance(model, XDustNode)) {
          result = model.render(chain, context, origModel);
        } else if (_isInstance(model, XDustContextResolver)) {
          result = model.resolve(context, origModel);
        } else if (_isInstance(model, XDustContext)) {
          result = model.tail;
        } else {
          result = model.toString();
        }
        if (this.filters) {
          _each(this.filters, function(i, flag) {
            if (dust.filters[flag]) {
              result = dust.filters[flag](result);
            }
          });
        } else {
          result = dust.escapeHTML(result);
        }
      }
      return result;
    }/*,
    toJSON: function() {
      return [this.alias, '(', this.context.toJSON(), ',', _stringify(this.blocks), ',', _stringify(this.filters), ')'].join('');
    }*/
  }),
  XDustLogicNode = _extend(XDustNode, function(path, scope, params, blocks, bodies) {
    XDustNode.call(this, blocks);
    this.bodies = {};
    if (bodies) {
      _updateDict(this.bodies, bodies);
    } else {
      this.startBody('block');
    }
    this.params = _updateDict({}, params);
    this.context = path ? new XDustContextResolver(path) : UNDEFINED;
    this.scope = scope ? new XDustContextResolver(scope) : UNDEFINED;
  }, {
    allowIter: true,
    startBody: function(name) {
      return this.currentBody = this.bodies[name] = new XDustNodeList();
    },
    endBody: function() {
      this.currentBody = UNDEFINED;
    },
    prepareModel: function(chain, context, model) {
      var params = {},
          name,
          result;
      if (this.params) {
        for (name in this.params) {
          params[name] = this.params[name].render(chain, context, context);
        }
      }
      result = new XDustContext(context, model, params);
      result.update(model);
      return result;
    },
    renderBody: function(name, chain, context, model) {
      var sb = [],
          body = this.bodies[name];
      context = new XDustContext(context, model, this.params);
      if (this.scope) {
        model = this.scope.resolve(context, model);
      } else if (this.context && typeof this.context != 'string') {
        model = this.context.resolve(context, model);
      }
      if (body) {
        chain = new XDustRenderChain(chain, body);
        if (this.allowIter && _isInstance(model, Array)) {
          var length = model.length;
          if (name == 'else' && length < 1) {
            sb.push(body.render(chain, context, UNDEFINED));
          } else {
            _each(model, function(i, iterModel) {
              iterModel = this.prepareModel(chain, context, iterModel);
              _updateDict(iterModel.params, {
                "@idx": i,
                "@sep": i != length - 1
              });
              sb.push(body.render(chain, context, iterModel));
            }, this);
          }
        } else {
          model = this.prepareModel(chain, context, model);
          sb.push(body.render(chain, context, model));
        }
      }
      return sb.join('');
    },
    chooseBodyName: function(context, model) {
      var resolved = this.context.resolve(context, model);
      if (_isInstance(resolved, Array) && resolved.length < 1) {
        resolved = false;
      }
      return resolved ? 'block' : 'else';
    },
    render: function(chain, context, model) {
      chain = new XDustRenderChain(chain, this);
      context = new XDustContext(context, UNDEFINED, this.params);
      var bodyName = this.chooseBodyName(context, model);
      return this.renderBody(bodyName, chain, context, model);
    }/*,
    toJSON: function() {
      return [this.alias, '(', this.context.toJSON(), ',', (this.scope ? this.scope.toJSON() : 'null'), ',', _stringify(this.params), ',', _stringify(this.blocks), ',', _stringify(this.bodies), ')'].join('');
    }*/
  }),
  XDustExistsNode = _extend(XDustLogicNode, function() {
    XDustLogicNode.apply(this, arguments);
  }, {
    operator: '?',
    allowIter: false,
    prepareModel: function(chain, context, model) {
      return new XDustContext(context, context, this.params);
    }
  }),
  XDustNotExistsNode = _extend(XDustExistsNode, function() {
    XDustExistsNode.apply(this, arguments);
  }, {
    prepareModel: function(chain, context, model) {
      return this.context.resolve(context, model) ? 'else' : 'block';
    }
  }),
  XDustHelperNode = _extend(XDustLogicNode, function(name, scope, params, blocks, bodies) {
    XDustLogicNode.call(this, UNDEFINED, scope, params, blocks, bodies);
    this.context = name;
  }, {
    render: function(chain, context, model) {
      chain = new XDustRenderChain(chain, this);
      context = new XDustContext(this.params, context);
      return dust.helpers[this.context](chain, context, model);
    }
  }),
  XDustIndexNode = _extend(XDustNodeList, function() {
    XDustNodeList.apply(this, arguments);
  }, {
    prepareModel: function(chain, context, model) {
      if (model.get('@idx') !== UNDEFINED) {
        return model.get('@idx').toString();
      } else {
        return UNDEFINED;
      }
    }
  }),
  XDustSepNode = _extend(XDustNodeList, function() {
    XDustNodeList.apply(this, arguments);
  }, {
    prepareModel: function(chain, context, model) {
      if (model.get('@sep')) {
        return XDustNodeList.prototype.prepareModel.apply(this, arguments);
      } else {
        return UNDEFINED;
      }
    }
  }),
  XDustEscapedCharacterNode = _extend(XDustNode, function(code, blocks) {
    XDustNode.call(this, blocks);
    this.code = code;
    this.character = this.characters[code];
  }, {
    characters: {
      n: '\n',
      r: '\r',
      s: ' ',
      lb: '{',
      rb: '}'
    },
    render: function(chain, context, model) {
      return this.character;
    }/*,
    toJSON: function() {
      return [this.alias, '(', _stringify(this.code), ')'].join('');
    }*/
  }),
  XDustPartialNode = _extend(XDustNode, function(include, scope, blocks) {
    XDustNode.call(this, blocks);
    this.include = include;
    this.scope = scope ? new XDustContextResolver(scope) : UNDEFINED;
  }, {
    render: function(chain, context, model) {
      if (this.scope) {
        model = this.scope.resolve(context, model);
      }
      chain = new XDustRenderChain(chain, this);
      name = this.include;
      if (_isInstance(this.include, XDustNodeList)) {
        name = this.include.render(chain, context, model);
      }
      return dust.load(name).render(chain, context, model);
    }/*,
    toJSON: function() {
      return [this.alias, '(', _stringify(this.include), ',', _stringify(this.scope), ',', _stringify(this.blocks), ')'].join('');
    }*/
  }),
  XDustBlockNode = _extend(XDustNodeList, function(name, blocks, nodes) {
    XDustNodeList.call(this, blocks, nodes);
    this.name = name;
  }, {
    render: function(chain, context, model) {
      block = chain.getBlock(this.name);
      if (block) {
        return block.render(chain, context, model);
      } else {
        return XDustNodeList.prototype.render.apply(this, arguments);
      }
    }/*,
    toJSON: function() {
      return [this.alias, '(', _stringify(this.name), ',', _stringify(this.blocks), ',', _stringify(this.nodes), ')'].join('');
    }*/
  }),
  XDustInlinePartialNode = _extend(XDustNodeList, function(name, blocks, nodes) {
    XDustNodeList.call(this, blocks, nodes);
    this.name = name;
  }, {
    asBlock: function() {
      return new XDustNodeList(null, this.nodes);
    },
    render: function(chain, context, model) {
      return '';
    }/*,
    toJSON: function() {
      return [this.alias, '(', _stringify(this.name), ',', _stringify(this.blocks), ',', _stringify(this.nodes), ')'].join('');
    }*/
  }),
  XDustNodeListParser = _extend(function() {
    // pass
  }, {
    parse: function(str) {
      str = str.replace(/(\{!.+?!\})|(^\s+)|(\s+$)/gm, '');
      var nodes = [new XDustNodeList()],
          depth = 0,
          exp = /(\{[\~\#\?\@\:\<\>\+\/\^]?([a-zA-Z0-9_\$\.]+|"[^"]+")(\:[a-zA-Z0-9\$\.]+)?(\|[a-z]+)*?( \w+\=(("[^"]*?")|([\w\.]+)))*?\/?\})/mg,
          lastEnd = 0,
          start,
          end,
          match,
          depthChange,
          node,
          head,
          tag,
          operator,
          tagName,
          scope,
          params,
          selfClosed,
          root,
          filters,
          tail,
          s;
      while (match = exp.exec(str)) {
        depthChange = false;
        start = match.index;
        end = start + match[0].length;
        if (lastEnd != start) {
          head = str.slice(lastEnd, start);
          if (head) {
            nodes[depth].add(new XDustTextNode(head));
          }
        }
        lastEnd = end;
        node = UNDEFINED;
        tag = str.slice(start + 1, end - 1);
        operator = tag.charAt(0);
        tag = tag.split(' ');
        if (_contains(OPERATORS, operator)) {
          tagName = tag[0].slice(1).split(':');
          scope = tagName.length > 1 ? tagName[1] : UNDEFINED;
          tagName = tagName[0];
          params = UNDEFINED;
          s = tag[tag.length - 1];
          selfClosed = _endsWith(tagName, '/');
          if (selfClosed) {
            tagName = tagName.slice(0, -1);
          } else if (scope && _endsWith(scope, '/')) {
            scope = scope.slice(0, -1);
            selfClosed = true;
          } else if (s && _endsWith(s, '/')) {
            tag[tag.length - 1] = s.slice(0, -1);
            selfClosed = true;
          }
          if (operator == '~') {
            node = new XDustEscapedCharacterNode(tagName);
          } else if (operator == '#') {
            if (_hasProp(dust.helpers, tagName)) {
              node = new XDustHelperNode(tagName, scope, params);
            } else {
              node = new XDustLogicNode(tagName, scope, params);
            }
          } else if (operator == '?') {
            node = new XDustExistsNode(tagName, scope, params);
          } else if (operator == '@') {
            name = tag[0].slice(1);
            if (name == 'idx') {
              node = new XDustIndexNode();
            } else if (name == 'sep') {
              node = new XDustSepNode();
            }
          } else if (operator == '>') {
            if (tagName.charAt(0) == '"') {
              tagName = this.parse(tagName.replace(/^"|"$/g, ''));
            }
            node = new XDustPartialNode(tagName, scope);
          } else if (operator == '+') {
            node = new XDustBlockNode(tagName);
          } else if (operator == '<') {
            node = new XDustInlinePartialNode(tagName);
          } else {
            node = new XDustTextNode('UNDEFINED:' + tag.join(' '));
          }
          _each(tag.slice(1), function(i, param) {
            param = param.split('=');
            var name = param[0],
                value = param.slice(1).join('=');
            if (value.charAt(0) != '"') {
              value = new XDustVariableNode(value);
            } else {
              value = this.parse(value.replace(/(^")|("$)|("\/$)/g, ''));
            }
            node.params[name] = value;
          }, this);
          if (!selfClosed) {          
            if (_contains(OPERATORS_WITH_BODY, operator)) {
              depthChange = true;
              if (_isInstance(node, XDustNodeList)) {
                if (_isInstance(node, XDustInlinePartialNode)) {
                  nodes[depth].setBlock(node.name, node);
                }
                nodes[depth].add(node);
                depth += 1;
                nodes[depth] = node;
              } else if (_isInstance(node, XDustLogicNode)) {
                nodes[depth].add(node);
                nodes[++depth] = node.currentBody;
              } else {
                root = nodes[depth - 1].last();
                root.endBody();
                nodes[depth] = root.startBody(tagName);
              }
            } else if (operator == '/') {
              depthChange = true;
              if (depth > 0) {
                nodes.splice(depth--, 1);
              }
            }
          }
        } else {
          tag = tag[0].split('|');
          filters = tag.splice(1);
          tag = tag[0];
          node = new XDustVariableNode(tag, null, filters);
        }
        if (node && !depthChange) {
          nodes[depth].add(node);
        }
      }
      tail = str.slice(lastEnd);
      if (tail) {
        nodes[depth].add(new XDustTextNode(tail));
      }
      return nodes[0];
    }
  }),
  XDustTemplate = _extend(function(name, rootNode, srcFile) {
    this.name = name;
    this.rootNode = rootNode;
    this.srcFile = srcFile;
  }, {
    render: function(model, chain, context) {
      return this.rootNode.render(chain, context, model);
    }/*,
    toJSON: function() {
      return ['(function(d){var x=d.nodeTypes;d.register(', _stringify(this.name), ',', _stringify(this.rootNode), ')})(window.dust);'].join('');
    }*/
  }),
  /**
   * @class XDust
   * The x-dust templating engine type
   *
   * @constructor
   */
  XDust = _extend(function() {
    /**
     * @field {XDustNodeListParser} parser
     * The parser (used to convert string code to node lists)
     */
    this.parser = new XDustNodeListParser();
    /**
     * @field {Object} templates
     * A hash of template names to node list objects
     */
    this.templates = {};
    /**
     * @field {Object} helpers
     * A hash of helper functions
     */
    this.helpers = {};
    /**
     * @field {Object} filters
     * A hash of variable value filters
     */
    this.filters = {
      h: this.escapeHTML,
      j: this.escapeJS,
      u: this.escapeURI,
      uc: this.escapeURIComponent
    };
    var contextPath = null;
    /**
     * @method getContextPath
     * Gets the base URL for templates
     * @return {String}  The current base URL
     */
    this.getContextPath = function() {
      if (!contextPath) {
        this.setContextPath(window.location.toString());
      }
      return contextPath;
    };
    /**
     * @method setContextPath
     * Sets the base URL for templates
     * @param {String} value  The new base URL
     */
    this.setContextPath = function(value) {
      contextPath = value.split('#')[0].split('?')[0].replace(/\/[^\/]*?\..[^\/]*?$/, '');
    };
  }, {
    /**
     * @method escapeHTML
     * Encodes a string for inclusion in HTML
     *
     * @param {String} str  The string to encode
     * @return {String}  The encoded string
     */
    escapeHTML: function(str) {
      str = str + '';
      if (!/[&<>\"]/.test(str)) {
        return str;
      } else {
        return str.replace(/&/, '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;').replace("'", '&squot;');
      }
    },
    /**
     * @method escapeJS
     * Encodes a string for inclusion in JavaScript
     *
     * @param {String} str  The string to encode
     * @return {String}  The encoded string
     */
    escapeJS: function(str) {
      str = str + '';
      return str.replace('\\', '\\\\').replace('"', '\\"').replace("'", "\\'").replace('\r', '\\r').replace('\u2028', '\\u2028').replace('\u2029', '\\u2029').replace('\n', '\\n').replace('\f', '\\f').replace('\t', '\\t')
    },
    /**
     * @method escapeURI
     * Encodes a string for inclusion in a URL
     *
     * @param {String} str  The string to encode
     * @return {String}  The encoded string
     */
    escapeURI: function(str) {
      return encodeURI(str);
    },
    /**
     * @method escapeURIComponent
     * Encodes a string for inclusion in a URL path
     *
     * @param {String} str  The string to encode
     * @return {String}  The encoded string
     */
    escapeURIComponent: function(str) {
      return encodeURIComponent(str);
    },
    /**
     * @method register
     * Saves an [[XDustNode]] for use as a template
     *
     * @sig
     * @param {String} name  The name of the template
     * @param {XDustNode} rootNode  The root node of the template
     *
     * @sig
     * @param {String} name  The name of the template
     * @param {XDustNode} rootNode  The root node of the template
     * @param {String} srcFile  The file that produced the node
     */
    register: function(name, rootNode, srcFile) {
      this.templates[name] = new XDustTemplate(name, rootNode, srcFile);
    },
    /**
     * @method compile
     * Compiles code into an [[XDustNode]]
     *
     * @sig
     * @param {String} str  The template code
     * @param {String} name  The name of the template
     * @return {XDustNode} The root node of the new template
     *
     * @sig
     * @param {String} str  The template code
     * @param {String} name  The name of the template
     * @param {String} srcFile  The file that produced the code
     * @return {XDustNode} The root node of the new template
     */
    compile: function(str, name, srcFile) {
      var compiled = this.parser.parse(str);
      this.register(name, compiled, srcFile);
      return compiled;
    },
    /*
    compileFn: function(str, name, srcFile) {
      var compiled = this.parser.parse(str);
      return '(function(xd,x){xd.register('
        + JSON.stringify(name)
        + ','
        + compiled.toJSON()
        + (srcFile ? ',' + JSON.stringify(srcFile) : '')
        + ')})(xdust,xdust.nodeTypes);';
    },
    */
    /**
     * @method load
     * Creates a template from a file (or retrieves a cached version
     * of the template if that file has already been loaded)
     *
     * @param {String} srcFile  The URL of the template file
     * @param {String} name  The name of the new template
     * @return {XDustNode}  The root node of the new template
     */
    load: function(srcFile, name) {
      if (name === UNDEFINED) {
        name = srcFile;
      }
      if (_hasProp(this.templates, srcFile)) {
        return this.templates[name].rootNode;
      } else {
        if (srcFile.indexOf('~') == 0) {
          srcFile = srcFile.replace('~', this.getContextPath());
        }
        var xhr = new XMLHttpRequest();
        xhr.open('GET', srcFile, false);
        xhr.send(null);
        if (xhr.status === 200 || xhr.status === 0) {
          return this.compile(xhr.responseText, name, srcFile);
        }
      }
    },
    /**
     * @method render
     * Pairs a model with a template and renders the result
     *
     * @param {String} name  The name of the template to render
     * @param {Object} model  The data object to pass to the template
     * @param {Function} callback  A callback in the form f(err, out)
     *     that accepts an error as its first argument and the string
     *     output of the renderer as the second. If the error is not
     *     null, then a problem occurred during rendering.
     */
    render: function(name, model, callback) {
      var out = null,
          err = null;
      try {
        out = this.templates[name].render(model);
      } catch(e) {
        err = e;
      }
      callback(err, out);
    }
  });

/**
 * @field {XDust} window.xdust
 * @static
 * An instance of the dust templating engine
 */
window.xdust = dust = new XDust();

/*

(function() {
  dust.nodeTypes = {};
  var c = 65,
      types = [
          XDustContext,
          XDustContextResolver,
          XDustRenderChain,
          XDustNode,
          XDustNodeList,
          XDustTextNode,
          XDustVariableNode,
          XDustLogicNode,
          XDustExistsNode,
          XDustNotExistsNode,
          XDustHelperNode,
          XDustIndexNode,
          XDustSepNode,
          XDustEscapedCharacterNode,
          XDustPartialNode,
          XDustBlockNode,
          XDustInlinePartialNode
        ];
  _each(types, function(i, type) {
    var ch = String.fromCharCode(c++);
    type.prototype.alias = 'x.' + ch;
    dust.nodeTypes[ch] = function(a, b, c, d, e, f, g, h) {
      return new type(a, b, c, d, e, f, g, h);
    };
  });
})();

*/

})();