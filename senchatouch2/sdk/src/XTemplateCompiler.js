/**
 * This class compiles the XTemplate syntax into a function object. The function is used
 * like so:
 *
 *      function (out, values, parent, xindex, xcount) {
 *          // out is the output array to store results
 *          // values, parent, xindex and xcount have their historical meaning
 *      }
 *
 * @markdown
 * @private
 */
Ext.define('Ext.XTemplateCompiler', {
    extend: 'Ext.XTemplateParser',

    // Chrome really likes "new Function" to realize the code block (as in it is
    // 2x-3x faster to call it than using eval), but Firefox chokes on it badly.
    // IE and Opera are also fine with the "new Function" technique.
    useEval: Ext.isGecko,

    useFormat: true,

    propNameRe: /^[\w\d\$]*$/,

    compile: function (tpl) {
        var me = this,
            code = me.generate(tpl);

        // When using "new Function", we have to pass our "Ext" variable to it in order to
        // support sandboxing. If we did not, the generated function would use the global
        // "Ext", not the "Ext" from our sandbox (scope chain).
        //
        return me.useEval ? me.evalTpl(code) : (new Function('Ext', code))(Ext);
    },

    generate: function (tpl) {
        var me = this;

        me.body = [
            'var c0=values, p0=parent, n0=xcount, i0=xindex;\n'
        ];
        me.funcs = [
            'var fm=Ext.util.Format;' // note: Ext here is properly sandboxed
        ];
        me.switches = [];

        me.parse(tpl);

        me.funcs.push(
            (me.useEval ? '$=' : 'return') + ' function (' + me.fnArgs + ') {',
                me.body.join(''),
            '}'
        );

        var code = me.funcs.join('\n');

        return code;
    },

    //-----------------------------------
    // XTemplateParser callouts

    doText: function (text) {
        text = text.replace(this.aposRe, "\\'");
        text = text.replace(this.newLineRe, '\\n');
        this.body.push('out.push(\'', text, '\')\n');
    },

    doExpr: function (expr) {
        this.body.push('out.push(String(', expr, '))\n');
    },

    doTag: function (tag) {
        this.doExpr(this.parseTag(tag));
    },

    doElse: function () {
        this.body.push('} else {\n');
    },

    doEval: function (text) {
        this.body.push(text, '\n');
    },

    doIf: function (action, actions) {
        var me = this;

        // If it's just a propName, use it directly in the if
        if (me.propNameRe.test(action)) {
            me.body.push('if (', me.parseTag(action), ') {\n');
        }
        // Otherwise, it must be an expression, and needs to be returned from an fn which uses with(values)
        else {
            me.body.push('if (', me.addFn(action), me.callFn, ') {\n');
        }
        if (actions.exec) {
            me.doExec(actions.exec);
        }
    },

    doElseIf: function (action, actions) {
        var me = this;

        // If it's just a propName, use it directly in the else if
        if (me.propNameRe.test(action)) {
            me.body.push('} else if (', me.parseTag(action), ') {\n');
        }
        // Otherwise, it must be an expression, and needs to be returned from an fn which uses with(values)
        else {
            me.body.push('} else if (', me.addFn(action), me.callFn, ') {\n');
        }
        if (actions.exec) {
            me.doExec(actions.exec);
        }
    },

    doSwitch: function (action) {
        var me = this;

        // If it's just a propName, use it directly in the switch
        if (me.propNameRe.test(action)) {
            me.body.push('switch (', me.parseTag(action), ') {\n');
        }
        // Otherwise, it must be an expression, and needs to be returned from an fn which uses with(values)
        else {
            me.body.push('switch (', me.addFn(action), me.callFn, ') {\n');
        }
        me.switches.push(0);
    },

    doCase: function (action) {
        var me = this,
            cases = Ext.isArray(action) ? action : [action],
            n = me.switches.length - 1,
            match, i;

        if (me.switches[n]) {
            me.body.push('break;\n');
        } else {
            me.switches[n]++;
        }

        for (i = 0, n = cases.length; i < n; ++i) {
            match = me.intRe.exec(cases[i]);
            cases[i] = match ? match[1] : ("'" + cases[i].replace(me.aposRe,"\\'") + "'");
        }

        me.body.push('case ', cases.join(': case '), ':\n');
    },

    doDefault: function () {
        var me = this,
            n = me.switches.length - 1;

        if (me.switches[n]) {
            me.body.push('break;\n');
        } else {
            me.switches[n]++;
        }

        me.body.push('default:\n');
    },

    doEnd: function (type, actions) {
        var me = this,
            L = me.level-1;

        if (type == 'for') {
            /*
            To exit a for loop we must restore the outer loop's context. The code looks
            like this (which goes with that produced by doFor:

                    for (...) { // the part generated by doFor
                        ...  // the body of the for loop

                        // ... any tpl for exec statement goes here...
                    }
                    parent = p1;
                    values = r2;
                    xcount = n1;
                    xindex = i1
            */
            if (actions.exec) {
                me.doExec(actions.exec);
            }

            me.body.push('}\n');
            me.body.push('parent=p',L,';values=r',L+1,';xcount=n',L,';xindex=i',L,'\n');
        } else if (type == 'if' || type == 'switch') {
            me.body.push('}\n');
        }
    },

    doFor: function (action, actions) {
        var me = this,
            s = me.addFn(action),
            L = me.level,
            up = L-1;

        /*
        We are trying to produce a block of code that looks like below. We use the nesting
        level to uniquely name the control variables.

            var c2 = f5.call(this, out, values, parent, xindex, xcount),
                    // c2 is the context object for the for loop
                a2 = Ext.isArray(c2),
                    // a2 is the isArray result for the context
                p2 = (parent=c1),
                    // p2 is the parent context (of the outer for loop)
                r2 = values
                    // r2 is the values object to

            // i2 is the loop index and n2 is the number (xcount) of this for loop
            for (var i2 = 0, n2 = a2 ? c2.length : (c2 ? 1 : 0), xcount = n2; i2 < n2; ++i2) {
                values=a2?c2[i2]:c2   // adjust special vars to inner scope
                xindex=i2+1           // xindex is 1-based

        The body of the loop is whatever comes between the tpl and /tpl statements (which
        is handled by doEnd).
        */

        me.body.push('var c',L,'=',s,me.callFn,', a',L,'=Ext.isArray(c',L,'),p',L,'=(parent=c',up,'),r',L,'=values\n',
            'for (var i',L,'=0,n',L,'=a',L,'?c',L,'.length:(c',L,'?1:0), xcount=n',L,';i',L,'<n'+L+';++i',L,'){\n',
            'values=a',L,'?c',L,'[i',L,']:c',L,'\n',
            'xindex=i',L,'+1\n');
    },

    doExec: function (action, actions) {
        var me = this,
            name = 'f' + me.funcs.length;

        me.funcs.push('function ' + name + '(' + me.fnArgs + ') {',
                            ' try { with(values) {',
                            '  ' + action,
                            ' }} catch(e) {}',
                      '}');

        me.body.push(name + me.callFn + '\n');
    },

    //-----------------------------------
    // Internal

    addFn: function (body) {
        var me = this,
            name = 'f' + me.funcs.length;

        if (body === '.') {
            me.funcs.push('function ' + name + '(' + me.fnArgs + ') {',
                            ' return values',
                       '}');
        } else if (body === '..') {
            me.funcs.push('function ' + name + '(' + me.fnArgs + ') {',
                            ' return parent',
                       '}');
        } else {
            me.funcs.push('function ' + name + '(' + me.fnArgs + ') {',
                            ' try { with(values) {',
                            '  return(' + body + ')',
                            ' }} catch(e) {}',
                       '}');
        }

        return name;
    },

    parseTag: function (tag) {
        var m = this.tagRe.exec(tag),
            name = m[1],
            format = m[2],
            args = m[3],
            math = m[4],
            v;

        // name = "." - Just use the values object.
        if (name == '.') {
            // filter to not include arrays/objects/nulls
            v = 'Ext.Array.indexOf(["string", "number", "boolean"], typeof values) > -1 || Ext.isDate(values) ? values : ""';
        }
        // name = "#" - Use the xindex
        else if (name == '#') {
            v = 'xindex';
        }
        else if (name.substr(0, 7) == "parent.") {
            v = name;
        }
        // name has a . in it - Use object literal notation, starting from values
        else if ((name.indexOf('.') !== -1) && (name.indexOf('-') === -1)) {

            v = "values." + name;
        }
        // name is a property of values
        else {
            v = "values['" + name + "']";
        }

        if (math) {
            v = '(' + v + math + ')';
        }

        if (format && this.useFormat) {
            args = args ? ',' + args : "";
            if (format.substr(0, 5) != "this.") {
                format = "fm." + format + '(';
            } else {
                format += '(';
            }
        } else {
            args = '';
            format = "(" + v + " === undefined ? '' : ";
        }

        return format + v + args + ')';
    },

    // @private
    evalTpl: function ($) {

        // We have to use eval to realize the code block and capture the inner func we also
        // don't want a deep scope chain. We only do this in Firefox and it is also unhappy
        // with eval containing a return statement, so instead we assign to "$" and return
        // that. Because we use "eval", we are automatically sandboxed properly.
        eval($);
        return $;
    },

    newLineRe: /\r\n|\r|\n/g,
    aposRe: /[']/g,
    intRe:  /^\s*(\d+)\s*$/,
    tagRe:  /([\w-\.\#]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?(\s?[\+\-\*\/]\s?[\d\.\+\-\*\/\(\)]+)?/

}, function () {
    var proto = this.prototype;

    proto.fnArgs = 'out,values,parent,xindex,xcount';
    proto.callFn = '.call(this,' + proto.fnArgs + ')';
});