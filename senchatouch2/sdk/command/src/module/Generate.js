Ext.define('Command.module.Generate', {
    extend: 'Command.module.Abstract',

    description: 'Automates the generation of projects and files',

    actions: {
        app: [
            "Generate a new project with the recommended structure",
            ['name', 'n', 'The namespace of the application to create. ' +
                'This will be used as the prefix for all your classes', 'string', null, 'MyApp'],
            ['path', 'p', 'The directory path to generate this application to.', 'string', null, '/path/to/myapp'],
            ['library', 'l', "The library's build to develop your application with, either 'core' or 'all'. " +
                "Defaults to 'core'." +
                "\n                          " +
                "+ Use 'all' if your application make use of almost every class available in the whole framework" +
                "\n                          " +
                "+ Use 'core' if your application only make use of a portion of the framework. " +
                "\n                            " +
                "When you deploy the application, it only includes exactly what it needs.",
                'string', 'core', 'all']
        ],
        model: [
            "Generate a Model for an existing project",
            ['name', 'n', 'The name of the Model to create', 'string', null, 'User'],
            ['fields', 'f', 'The set of fields to add to the Model', 'array', null, 'id:int,name,email']
        ],
        controller: [
            "Generate a Controller for an existing project",
            ['name', 'n', 'The name of the Controller to create', 'string', null, 'User']
        ],
        profile: [
            "Generate a Profile for an existing project",
            ['name', 'n', 'The name of the Profile to create', 'string', null, 'Phone']
        ]
        // form: [
        //     "Generate a Form for an existing project",
        //     ['name', 'n', 'The name of the Form to create', 'string', null, 'User'],
        //     ['fields', 'f', 'The set of fields to add to the Form', 'string', null, 'name:string,email:email,message:string']
        // ]
    },

    /**
     * For each action defined above we automatically create the function that invokes its generator. This just creates
     * those functions, passing the arguments in as an object instead of an array
     */
    constructor: function() {
        var actions = this.actions,
            actionName;

        for (actionName in actions) {
            this[actionName] = function(actionName) {
                return function() {
                    var params = this.actions[actionName].slice(1),
                        length = params.length,
                        args   = [],
                        paramName, i;

                    for (i = 0; i < length; i++) {
                        paramName = params[i][0];

                        args[paramName] = arguments[i];
                    }

                    Ext.create('Command.module.generate.' + Ext.String.capitalize(actionName), args, this.cli);
                };
            }(actionName);
        }

        this.callParent(arguments);
    }
});
