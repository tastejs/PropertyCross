/**
 * Sencha Command
 * @author Jacky Nguyen <jacky@sencha.com>
 */
(function() {
    var sdkToolsVersion = '2.0.0-beta3',
        sdkToolsEnvName = 'SENCHA_SDK_TOOLS_' + sdkToolsVersion.replace(/[\.-]/g, '_').toUpperCase(),
        coreFiles = [
            "Ext.js",
            "version/Version.js",
            "lang/String.js",
            "lang/Number.js",
            "lang/Array.js",
            "lang/Function.js",
            "lang/Object.js",
            "lang/Date.js",
            "lang/JSON.js",
            "class/Base.js",
            "class/Class.js",
            "class/ClassManager.js",
            "class/Loader.js",
            "lang/Error.js"
        ],
        path = require('path'),
        currentPath = __dirname,
        srcPath = path.resolve(currentPath, '../src'),
        corePath = path.join(srcPath, 'core'),
        sdkToolsPath = process.env[sdkToolsEnvName],
        command;

    if (!sdkToolsPath) {
        console.log('[ERROR] Sencha SDK Tools ' + sdkToolsVersion + ' cannot be found from your system ('+sdkToolsEnvName+
            ' environment variable is not set). Please download and install version "'+
            sdkToolsVersion+'" of the tools from http://www.sencha.com/products/sdk-tools . ' +
            'Close this terminal and open a new one after the installation is complete.');
        return;
    }

    coreFiles.forEach(function(file) {
        require(path.join(corePath, file));
    });

    Ext.Loader.setConfig({
        paths: {
            Ext: srcPath,
            Command: path.join(currentPath, 'src')
        }
    });

    command = Ext.create('Command.Cli', {
        version: '2.0.2',
        currentPath: currentPath,
        binPath: path.join(sdkToolsPath, 'bin'),
        modules: {
            'app': 'Application',
            'fs': 'FileSystem',
            'manifest': 'Manifest',
            'test': 'Test',
            'generate': 'Generate',
            'package': 'Package'
        },
        logger: Ext.create('Ext.log.Logger', {
            writers: {
                cli: Ext.create('Command.log.writer.Cli', {
                    formatter: Ext.create('Command.log.formatter.Cli')
                })
            },
            minPriority: 'verbose'
        })
    });

    command.run(Array.prototype.slice.call(process.argv, 2));
})();
