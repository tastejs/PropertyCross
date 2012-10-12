
\033[4mUsage:\033[24m
    \033[31m\033[1msencha {name} [action] [arguments...]\033[22m\033[39m

\033[4mDescription:\033[24m
    {description}

\033[4mAvailable actions:\033[24m \033[24m(\033[31m\033[1m*\033[22m\033[39m) denotes required parameter

   <tpl for="actions">\033[31m\033[1m{name}\033[22m\033[39m    {description}
        {% var maxLength = 0; values.args.forEach(function(arg){ maxLength = Math.max(maxLength,arg[0].length) }); %}
    <tpl for="args">  -{[values[1]]}, --{[values[0]]}{[Array(maxLength - values[0].length + 1).join(" ")]}  <tpl if="values[4] === null">\033[31m\033[1m*\033[22m\033[39m</tpl> {[values[2]]}
    </tpl>
   </tpl>
For more information on a specific action, simply type:
    sencha {name} [action]

For example:
    sencha {name} {[values.actions[0].name]}
