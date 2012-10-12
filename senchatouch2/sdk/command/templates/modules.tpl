Sencha Command v{version}
Copyright (c) 2012 Sencha Inc.

\033[4mUsage:\033[24m
    \033[31m\033[1msencha [module] [action] [arguments...]\033[22m\033[39m

\033[4mExample:\033[24m
    sencha fs minify --from app.js --to app-minified.js --compressor closurecompiler

\033[4mAvailable modules:\033[24m
    {% values.maxAliasLength = 0; values.modules.forEach(function(module){ values.maxAliasLength = Math.max(values.maxAliasLength, module.name.length) }); %}
   <tpl for="modules">\033[31m\033[1m{name}\033[22m\033[39m{[Array(parent.maxAliasLength - values.name.length + 1).join(" ")]}     {description}
   </tpl>
For more information on a specific module, simply type:
    sencha [module]

For example:
    sencha fs

For more information on a specific action of a specific module, simply type:
    sencha [module] [action]

For example:
    sencha fs minify
