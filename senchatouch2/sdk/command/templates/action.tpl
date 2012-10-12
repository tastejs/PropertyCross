
\033[4mUsage:\033[24m
    \033[31m\033[1msencha {module} {name} [arguments...]\033[22m\033[39m

\033[4mDescription:\033[24m
    {description}

\033[4mArguments:\033[24m (\033[31m\033[1m*\033[22m\033[39m) denotes required parameter
{% var maxLength = 0; values.args.forEach(function(arg){ maxLength = Math.max(maxLength,arg[0].length) }); %}
    <tpl for="args">  -{[values[1]]}, --{[values[0]]}{[Array(maxLength - values[0].length + 1).join(" ")]}  <tpl if="values[4] === null">\033[31m\033[1m*\033[22m\033[39m</tpl> {[values[2]]}
    </tpl>
\033[4mExamples:\033[24m
    Long:
      \033[31m\033[1msencha {module} {name} <tpl for="args">--{[values[0]]}={[values[5]]} </tpl>\033[22m\033[39m

    Short:
      \033[31m\033[1msencha {module} {name} <tpl for="args">-{[values[1]]} {[values[5]]} </tpl>\033[22m\033[39m

    Shortest (arguments must be in the right order):
      \033[31m\033[1msencha {module} {name} <tpl for="args">{[values[5]]} </tpl>\033[22m\033[39m
