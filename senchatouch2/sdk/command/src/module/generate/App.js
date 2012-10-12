Ext.define('Command.module.generate.App', {
    extend: 'Command.module.generate.Generator',

    description: 'Automates the generation of a new project',

    getUniqueId: function() {
        return require('node-uuid').v1();
    },

    execute: function(args) {
        var path = require('path'),
            cwd = process.cwd(),
            sdkVersionFile = path.join(cwd, 'version.txt'),
            sdkVersion = new Ext.Version(require('fs').readFileSync(sdkVersionFile, 'utf8').trim()),
            appPath = path.resolve(args.path);

        this.mkdir(
            appPath,
            path.join(appPath, 'app'),
            path.join(appPath, 'app', 'model'),
            path.join(appPath, 'app', 'view'),
            path.join(appPath, 'app', 'controller'),
            path.join(appPath, 'app', 'store'),
            path.join(appPath, 'app', 'profile'),
            path.join(appPath, 'sdk'),
            path.join(appPath, 'sdk', 'src'),
            path.join(appPath, 'sdk', 'resources'),
            path.join(appPath, 'resources'),
            path.join(appPath, 'resources', 'css'),
            path.join(appPath, 'resources', 'images'),
            path.join(appPath, 'resources', 'icons'),
            path.join(appPath, 'resources', 'sass')
        );

        this.template('.senchasdk', path.join(appPath, '.senchasdk'));
        this.template('index.html', path.join(appPath, 'index.html'));
        this.template('app.js', path.join(appPath, 'app.js'));
        this.template('packager.json', path.join(appPath, 'packager.json'));
        this.template('app.json', path.join(appPath, 'app.json'), {
            name: args.name,
            sdkShortVersion: sdkVersion.getShortVersion(),
            sdkVersion: sdkVersion.toString(),
            library: args.library,
            uniqueId: this.getUniqueId()
        });
        this.template('app/view/Main.js', path.join(appPath, 'app', 'view', 'Main.js'));

        this.directory(path.join(cwd, 'src'), path.join(appPath, 'sdk', 'src'));
        this.directory(path.join(cwd, 'resources'), path.join(appPath, 'sdk', 'resources'));
        this.directory(path.join(cwd, 'command', 'src', 'module', 'generate', 'App', 'resources', 'icons'), path.join(appPath, 'resources', 'icons'));
        this.directory(path.join(cwd, 'command', 'src', 'module', 'generate', 'App', 'resources', 'loading'), path.join(appPath, 'resources', 'loading'));
        this.directory(path.join(cwd, 'command', 'src', 'module', 'generate', 'App', 'resources', 'startup'), path.join(appPath, 'resources', 'startup'));
        this.directory(path.join(cwd, 'command'), path.join(appPath, 'sdk', 'command'));

        this.file(path.join(cwd, 'microloader/development.js'), path.join(appPath, 'sdk', 'microloader/development.js'));
        this.file(path.join(cwd, 'microloader/testing.js'), path.join(appPath, 'sdk', 'microloader/testing.js'));
        this.file(path.join(cwd, 'microloader/production.js'), path.join(appPath, 'sdk', 'microloader/production.js'));

        this.file(path.join(cwd, 'version.txt'), path.join(appPath, 'sdk', 'version.txt'));
        this.file(path.join(cwd, 'sencha-touch-debug.js'), path.join(appPath, 'sdk', 'sencha-touch.js'));
        this.file(path.join(cwd, 'sencha-touch-all-debug.js'), path.join(appPath, 'sdk', 'sencha-touch-all.js'));

        this.template('resources/sass/app.scss', path.join(appPath, 'resources' , 'sass', 'app.scss'));
        this.template('resources/sass/config.rb', path.join(appPath, 'resources' , 'sass', 'config.rb'));
        this.file(path.join(cwd, 'resources/css-debug/sencha-touch.css'), path.join(appPath, 'resources', 'css', 'app.css'));
    }
});
