/**
 * @class Command.module.Application
 * @author Jacky Nguyen <jacky@sencha.com>
 */
Ext.define('Command.module.Application', {
    extend: 'Command.module.Abstract',

    description: 'Resolve application dependencies and build for production',

    actions: {
        create: [
            "(Alias to 'sencha generate app') Generate a new project with the recommended structure",
            ['name', 'n', 'The namespace of the application to create. ' +
                'This will be used as the prefix for all your classes', 'string', null, 'MyApp'],
            ['path', 'p', 'The directory path to generate this application to.', 'string', null, '/path/to/myapp'],
            ['library', 'l', "The library's build to develop your application with, either 'core' or 'all'. " +
                "Defaults to 'core'", 'string', 'core', 'all']
        ],
        upgrade: [
            "Upgrade the given application to the SDK at the current working directory",
            ['path', 'p', 'The directory path to the application to upgrade', 'string', null, '/path/to/myapp']
        ],
        resolve: [
            "Generate a list of dependencies in the exact loading order for the given application. " +
            "Note that the resolved paths are relative to the given application's HTML document",
            ['uri', 'u', 'The URI to the application\'s HTML document', 'string', null, 'http://localhost/myapp/index.html'],
            ['output', 'o', 'The file path to write the results to in JSON format.', 'string', null, 'dependencies.json']
        ],
        build: [
            "Build the application at the current working directory to the given path",
            ['environment', 'e', "The build environment, either 'testing', 'package', 'production', or 'native'" +
                "\n                          " +
                "+ 'testing' is meant for QA prior to production. All JavaScript and CSS Files are bundled, but not minified" +
                "\n                          " +
                "+ 'package' creates a self-contained, re-distributable production build that " +
                    "\n                             " +
                    "normally runs from local file system without the need for a web server" +
                "\n                          " +
                "+ 'production' creates a production build that is normally hosted on a web server and " +
                    "\n                             " +
                    "serve multiple clients (devices). The build is offline-capable and has built-in " +
                    "\n                             " +
                    "OTA delta updating feature" +
                "\n                          " +
                "+ 'native' first generates a 'package' build, then packages it as a native " +
                    "\n                             " +
                    "application, ready to be deployed to native platforms",
                'string', null, 'production'],
            ['destination', 'd', "The directory path to build this application to. " +
                "\n                          " +
                "If none given, the default path specified inside 'app.json' is used", 'string', '', '/path/to/deploy/myapp'],
            ['archive', 'a', "The directory path where all previous builds were stored," +
                "\n                          " +
                "needed to generate deltas between updates (for production only). " +
                "\n                          " +
                "If none given, the default path specified inside 'app.json' is used",
                'string', '', '/path/to/myapp/archive']
        ]
    },

    isSdkDirectory: function(sdkPath) {
        var path = require('path'),
            fs = this.getModule('fs');

        return path.existsSync(sdkPath) && path.existsSync(path.join(sdkPath, '.senchasdk')) &&
               fs.read(path.join(sdkPath, '.senchasdk')).trim() === '.';
    },

    isApplicationDirectory: function(appPath) {
        var path = require('path');

        return path.existsSync(appPath) && path.existsSync(path.join(appPath, '.senchasdk')) &&
               path.existsSync(path.join(appPath, 'app.json'));
    },

    create: function() {
        var module = this.getModule('generate'),
            sdkPath = process.cwd();

        if (!this.isSdkDirectory(sdkPath)) {
            throw new Error("The current working directory (" + sdkPath + ") is not a valid SDK directory. " +
                "Please 'cd' into a SDK directory before executing this command");
        }

        module.app.apply(module, arguments);
    },

    upgrade: function(appPath) {
        var sdkPath = process.cwd(),
            path = require('path'),
            fs = this.getModule('fs'),
            newSdkVersion = fs.read(path.join(sdkPath, 'version.txt')).trim(),
            appSdkPath, oldSdkVersion, oldSdkPath;

        if (!this.isSdkDirectory(sdkPath)) {
            throw new Error("The current working directory (" + sdkPath + ") is not a valid SDK directory. " +
                "Please 'cd' into a SDK directory before executing this command");
        }

        if (!this.isApplicationDirectory(appPath)) {
            throw new Error("" + appPath + " is not a valid application directory.");
        }

        appSdkPath = path.join(appPath, fs.read(path.join(appPath, '.senchasdk')).trim());
        oldSdkVersion = fs.read(path.join(appSdkPath, 'version.txt')).trim();
        oldSdkPath = appSdkPath + '-' + oldSdkVersion + '-backup';

        if (oldSdkVersion === newSdkVersion) {
            this.info("This SDK (version '" + newSdkVersion + "') is identical to the application's SDK, nothing to upgrade.");
            return;
        }

        this.info("Upgrading your application from SDK version '" + oldSdkVersion + "' to version '" + newSdkVersion + "'");
        fs.rename(appSdkPath, oldSdkPath);
        this.info("Renamed '" + appSdkPath + "' to '" + oldSdkPath + "' for backup");

        fs.copyDirectory(path.join(sdkPath, 'src'), path.join(appSdkPath, 'src'));
        fs.copyDirectory(path.join(sdkPath, 'resources'), path.join(appSdkPath, 'resources'));
        fs.copyDirectory(path.join(sdkPath, 'command'), path.join(appSdkPath, 'command'));
        fs.copyDirectory(path.join(sdkPath, 'microloader'), path.join(appSdkPath, 'microloader'));
        fs.copyFile(path.join(sdkPath, 'version.txt'), path.join(appSdkPath, 'version.txt'));
        fs.copyFile(path.join(sdkPath, 'sencha-touch-debug.js'), path.join(appSdkPath, 'sencha-touch.js'));
        fs.copyFile(path.join(sdkPath, 'sencha-touch-all-debug.js'), path.join(appSdkPath, 'sencha-touch-all.js'));

        this.info("Your application has successfully been upgraded. To revert this operation, simply remove '" + appSdkPath + "' and rename '" + oldSdkPath + "' back to '" + appSdkPath + "'");
    },

    resolve: function(uri, output, onSuccess, onFailure) {
        var parsedUri = require('url').parse(uri);

        if (!/^file|http/.test(parsedUri.protocol)) {
            uri = 'file:///' + require('path').resolve(uri).replace(/\\/g, '/');
        }

        this.exec('%s %s %s', [
            this.getBinaryPath('phantomjs'),
            this.getVendorPath('phantomjs/dependencies.js'),
            uri
        ], function(error, stdout, stderr) {
            if (error) {
                this.error(stdout || stderr);
                if (onFailure) {
                    onFailure()
                }
            }
            else {
                if (output) {
                    this.getModule('fs').write(output, stdout);
                }

                if (onSuccess) {
                    onSuccess(JSON.parse(stdout));
                }
            }
        });
    },

    build: function(environment, destination, archive) {
        var nativePackaging = false,
            src = process.cwd();

        if (environment == 'native') {
            environment = 'package';
            nativePackaging = true;
        }

        if (!/^testing|package|production$/.test(environment)) {
            throw new Error("Invalid environment argument of: '"+environment+"'," +
                " must be either 'testing', 'package', 'production' or 'native'");
        }

        if (!this.isApplicationDirectory(src)) {
            throw new Error("The current directory ('" + src + "') is not a valid application directory.");
        }

        var path = require('path'),
            fs = this.getModule('fs'),
            sdk = path.resolve(src, fs.read('.senchasdk').trim()),
            config = fs.readJson(path.join(src, 'app.json')),
            jsAssets = config.js || [],
            cssAssets = config.css || [],
            extras = config.extras || config.resources,
            ignore = Ext.Array.from(config.ignore),
            appCache = config.appCache,
            indexHtmlPath = config.indexHtmlPath || 'index.html',
            appUrl = config.url || path.join(src, indexHtmlPath),
            preprocessor = Ext.require('Command.Preprocessor').getInstance(),
            nodeFs = require('fs'),
            temp = Date.now(),
            indexHtml, assets, file, destinationFile, files,
            appJs, assetsCount, processedAssetsCount,
            packagerConfig, packagerJson, processIndex, ignoreFn;

        if (!/^file|http/.test(require('url').parse(appUrl).protocol)) {
            appUrl = 'file:///' + path.resolve(appUrl).replace(/\\/g, '/');
        }

        preprocessor.setParams(config.buildOptions || {});

        if (!destination) {
            destination = config.buildPaths[environment];
        }

        if (!archive) {
            archive = config.archivePath;
        }

        destination = path.resolve(destination);
        archive = path.resolve(archive);

        this.info("Deploying your application to " + destination);

        fs.mkdir(destination);

        jsAssets = jsAssets.map(function(asset) {
            if (typeof asset == 'string') {
                asset = { path: asset };
            }
            asset.type = 'js';
            return asset;
        });

        jsAssets.forEach(function(jsAsset) {
            if (jsAsset.bundle) {
                appJs = jsAsset.path;
            }
        });

        if (!appJs) {
            appJs = 'app.js';
        }

        appJs = path.join(destination, appJs);

        cssAssets = cssAssets.map(function(asset) {
            if (typeof asset == 'string') {
                asset = { path: asset };
            }
            asset.type = 'css';
            return asset;
        });

        assets = jsAssets.concat(cssAssets).filter(function(asset) {
            return !asset.shared || (environment != 'production');
        });

        assets.forEach(function(asset) {
            file = asset.path;
            fs.copyFile(path.join(src, file), path.join(destination, file));
            this.info("Copied " + file);
        }, this);

        ignore = ignore.map(function(regex){
            try {
                return new RegExp(regex);
            }
            catch (e) {
                throw new Error("Invalid ignore value ('" + regex + "'). Reason: " + e);
            }
        });

        ignoreFn = function(from, to) {
            var i, ln;
            for (i = 0,ln = ignore.length; i < ln; i++) {
                if (ignore[i].test(from)) {
                    this.info("Ignored " + from);
                    return false;
                }
            }
        }.bind(this);

        extras.forEach(function(extra) {
            fs.copy(path.join(src, extra), path.join(destination, extra), ignoreFn);
            this.info("Copied " + extra);
        }, this);

        processIndex = function(callback) {
            var appJson = JSON.stringify({
                id: config.id,
                js: jsAssets,
                css: cssAssets
            });

            fs.write(path.join(destination, 'app.json'), appJson);
            this.info("Generated app.json");

            indexHtml = fs.read(path.join(src, indexHtmlPath));

            if (environment == 'production' && appCache) {
                indexHtml = indexHtml.replace('<html manifest=""', '<html manifest="cache.manifest"');
            }

            fs.minify(path.join(sdk, 'microloader', (environment == 'production' ? 'production' : 'testing')+'.js'), null, 'closurecompiler', function(content) {
                indexHtml = indexHtml.replace(/<script id="microloader"([^<]+)<\/script>/,
                    '<script type="text/javascript">' +
                        content + ';Ext.blink(' + (environment == 'production' ? JSON.stringify({
                            id: config.id
                        }) : appJson) + ')' +
                    '</script>');

                fs.write(path.join(destination, indexHtmlPath), indexHtml);
                this.info("Embedded microloader into " + indexHtmlPath);

                if (callback) {
                    callback();
                }
            }.bind(this));
        }.bind(this);

        this.info("Resolving your application dependencies ("+appUrl+")");

        this.resolve(appUrl, null, function(dependencies) {
            this.info("Found " + dependencies.length + " dependencies. Concatenating all into '" + appJs + "'");

            files = dependencies.map(function(dependency) {
                return path.join(src, dependency.path);
            });

            files.push(appJs);

            fs.concat(files, appJs + '.' + temp, "\n");

            nodeFs.unlinkSync(appJs);
            nodeFs.renameSync(appJs + '.' + temp, appJs);

            processedAssetsCount = 0;
            assetsCount = assets.length;
            assets.forEach(function(asset) {
                file = asset.path;
                destinationFile = path.join(destination, file);

                if (asset.type == 'js') {
                    fs.write(destinationFile, preprocessor.process(destinationFile));
                    this.info("Processed " + file);
                }

                if (environment == 'testing') {
                    return;
                }

                this.info("Minifying " + file);

                fs.minify(destinationFile, destinationFile, null, function(destinationFile, file, asset) {
                    this.info("Minified " + file);

                    if (environment == 'production') {
                        var version = fs.checksum(destinationFile);
                        asset.version = version;

                        fs.prependFile(destinationFile, '/*' + version + '*/');
                        fs.copyFile(destinationFile, path.join(archive, file, version));

                        if (asset.update === 'delta') {
                            nodeFs.readdirSync(path.join(archive, file)).forEach(function(archivedVersion) {
                                if (archivedVersion === version) {
                                    return;
                                }

                                var deltaFile = path.join(destination, 'deltas', file, archivedVersion + '.json');

                                fs.write(deltaFile, '');
                                fs.delta(
                                    path.join(archive, file, archivedVersion), destinationFile, deltaFile,
                                    function() {
                                        this.info("Generated delta for: '" + file + "' from hash: '" +
                                            archivedVersion + "' to hash: '" + version + "'");
                                    }.bind(this)
                                );

                            }, this);
                        }
                    }

                    if (++processedAssetsCount == assetsCount) {
                        processIndex(function() {
                            if (environment == 'production' && appCache) {
                                appCache.cache = appCache.cache.map(function(cache) {
                                    var checksum = '';

                                    if (!/^(\/|(.*):\/\/)/.test(cache)) {
                                        this.info("Generating checksum for appCache item: " + cache);
                                        checksum = fs.checksum(path.join(destination, cache));
                                    }

                                    return {
                                        uri: cache,
                                        checksum: checksum
                                    }
                                }, this);

                                fs.write(path.join(destination, 'cache.manifest'), this.getTemplate('cache.manifest').apply(appCache));
                                this.info("Generated cache.manifest");
                            }

                            if (nativePackaging) {
                                packagerJson = fs.read(path.join(src, 'packager.json'));
                                packagerConfig = Ext.JSON.decode(packagerJson);

                                if (packagerConfig.platform.match(/iOS/)) {
                                    fs.copyDirectory(path.join(src, 'resources', 'icons'), destination, ignoreFn);
                                    fs.copyDirectory(path.join(src, 'resources', 'loading'), destination, ignoreFn);
                                }

                                packagerConfig.inputPath = destination;
                                packagerConfig.outputPath = path.resolve(config.buildPaths.native);
                                fs.mkdir(packagerConfig.outputPath);
                                fs.writeJson(path.join(src, 'packager.temp.json'), packagerConfig);

                                this.info("Packaging your application as a native app...");

                                this.getModule('package').run('packager.temp.json', function() {
                                    nodeFs.unlinkSync(path.join(src, 'packager.temp.json'));
                                });
                            }
                        }.bind(this));
                    }
                }.bind(this, destinationFile, file, asset));
            }, this);

            if (environment == 'testing') {
                processIndex();
            }

        }.bind(this), function() {
            this.error("Failed loading your application from: '"+appUrl+"'. " + (!config.url ? "Try setting the " +
                "absolute URL to your application for the 'url' item inside 'app.json'" : ""));
        }.bind(this));
    }
});
