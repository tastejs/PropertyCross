Ext.define('Command.module.Package', {
    extend: 'Command.module.Abstract',
    description: "Packages a Sencha Touch 2 application for native app stores",

    actions: {
        generate: [
            "Generates a Packager configuration JSON file",
            ['path', 'p', 'What to call the configuration file', 'string', 'packager.json', 'myconfigfile.json']
        ],

        build: [
            "Packages an app with the given configuration JSON file",
            ['path', 'p', 'What to call the configuration file', 'string', 'packager.json', 'myconfigfile.json']
        ],

        run: [
            "Packages and tries to run the application for the given configuration JSON file",
            ['path', 'p', 'What to call the configuration file', 'string', 'packager.json', 'myconfigfile.json']
        ]
    },

    generate: function(fileName) {
        this.exec('stbuild generate %s', [fileName], function(error, stdout, stderr) {
            if (stdout) {
                this.info(stdout);
            }

            if (stderr) {
                this.error(stderr);
            }
        });
    },

    build: function(fileName) {
        this.exec('stbuild package %s', [fileName], function(error, stdout, stderr) {
            if (stdout) {
                this.info(stdout);
            }

            if (stderr) {
                this.error(stderr);
            }
        });
    },

    run: function(fileName, callback) {
        this.exec('stbuild run %s', [fileName], function(error, stdout, stderr) {
            if (callback) {
                callback();
            }

            if (stdout) {
                this.info(stdout);
            }

            if (stderr) {
                this.error(stderr);
            }
        });
    }
});
