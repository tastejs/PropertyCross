/**
 * @class Command.module.FileSystem
 * @author Jacky Nguyen <jacky@sencha.com>
 */
Ext.define('Command.module.FileSystem', {
    extend: 'Command.module.Abstract',

    description: 'A set of useful utility actions to work with files. ' +
                 'Most commonly used actions are: concat, minify, delta',

    actions: {
        concat: [
            "Concatenate multiple files into one",
            ['from', 'f', 'List of files to concatenate, comma-separated', 'array', null, 'foo.js,bar.js,baz.js'],
            ['to', 't', 'The destination file to write concatenated content', 'string', null, 'target.js']
        ],
        minify: [
            "Minify a JavaScript file, currently support YUICompressor (default), Closure Compiler and UglifyJS",
            ['from', 'f', 'Path to the file to minify', 'string', null, 'app.js'],
            ['to', 't', 'Path to the destination file to write minified content to.', 'string', null, 'app-minified.js'],
            ['compressor', 'c',
                'The name of the compressor to use, can be either: "yuicompressor", ' +
                '"uglifyjs" or "closurecompiler". Defaults to "yuicompressor"', 'string', 'yuicompressor', 'uglifyjs']
        ],
        delta: [
            "Generates deltas between two files in JSON format",
            ['from', 'f', 'Path to the dictionary file', 'string', null, 'version1.js'],
            ['to', 't', 'Path to the target file to compare to', 'string', null, 'version2.js'],
            ['delta', 'd', 'Path to a JSON file to write the delta content to', 'string', null, 'delta.json']
        ]
    },

    /**
     * Concatenate multiple files into one
     * @param fromFiles
     * @param toFile
     */
    concat: function(fromFiles, toFile, separator) {
        var fs = require('fs'),
            i, ln, fromFile, fd;

        separator = separator || '';

        fd = fs.openSync(toFile, 'w');

        for (i = 0,ln = fromFiles.length; i < ln; i++) {
            fromFile = fromFiles[i];
            fs.writeSync(fd, this.read(fromFile) + separator);
        }

        fs.closeSync(fd);
    },

    /**
     * Minify a JavaScript file, currently support YUICompressor (default), Closure Compiler and UglifyJS
     * @param fromFiles
     * @param toFile
     */
    minify: function(fromFile, toFile, compressor, callback) {
        var command, jarPath, toArg, content;

        callback = callback || Ext.emptyFn;

        if (compressor === 'uglifyjs') {
            var uglifyjs = require('uglify-js'),
                jsp = uglifyjs.parser,
                pro = uglifyjs.uglify,
                ast = jsp.parse(this.read(fromFile));

            ast = pro.ast_mangle(ast); // get a new AST with mangled names
            ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
            content = pro.gen_code(ast);

            if (toFile) {
                this.write(toFile, content);
                callback();
            }
            else {
                callback(content);
            }
        }
        else {
            if (compressor === 'closurecompiler') {
                command = 'java -jar %s ' + (toFile ? '--js_output_file %s' : '%s') + ' --js %s';
                jarPath = this.getBinaryPath('closurecompiler.jar');
            }
            else {
                command = 'java -jar %s ' + (toFile ? '-o %s' : '%s') + ' %s';
                jarPath = this.getBinaryPath('yuicompressor.jar');
            }

            this.exec(command, [jarPath, toFile, fromFile], function(error, stdout, stderr) {
                if (error) {
                    this.error(error);
                    this.error(stderr);
                }
                else {
                    if (!toFile) {
                        callback(stdout);
                    }
                    else {
                        if (stdout) {
                            this.info(stdout);
                        }
                        callback();
                    }
                }
            });
        }
    },

    /**
     * Generates deltas between two files in JSON format
     * @param fromFile
     * @param toFile
     * @param delta
     */
    delta: function(fromFile, toFile, delta, callback) {
        this.exec('%s encode -json -dictionary %s -target %s -delta %s --stats', [
            this.getBinaryPath('vcdiff'),
            fromFile,
            toFile,
            delta
        ], function(error, stdout, stderr) {
            if (error) {
                this.error(stderr);
            }
            else {
                if (stdout) {
                    this.info(stdout);
                }

                // Fix malformed JSON generated from vcdiff (trailing comma), e.g [1,2,3,] -> [1,2,3]
                var content = this.read(delta);
                this.write(delta, content.substring(0, content.length - 2) + ']');
                callback();
            }
        });
    },

    mkdir: function() {
        var fs = require('fs'),
            path = require('path'),
            names = Array.prototype.slice.call(arguments),
            ln = names.length,
            i, j, subLn, name, parentDirName, dirNames;

        for (i = 0; i < ln; i++) {
            name = names[i];
            dirNames = [];

            while (!path.existsSync(name)) {
                dirNames.unshift(name);
                parentDirName = path.dirname(name);

                if (parentDirName === name) {
                    break;
                }

                name = parentDirName;
            }

            for (j = 0, subLn = dirNames.length; j < subLn; j++) {
                name = dirNames[j];
                fs.mkdirSync(name);
            }
        }
    },

    read: function(file) {
        return require('fs').readFileSync(file, 'utf8');
    },

    readJson: function(file) {
        return Ext.JSON.decode(this.read(file));
    },

    write: function(file, content) {
        var path = require('path');

        if (!path.existsSync(file)) {
            this.mkdir(path.dirname(file));
        }

        require('fs').writeFileSync(file, content, 'utf8');
    },

    rename: function(from, to) {
        return require('fs').renameSync(from, to);
    },

    removeFile: function(path) {
        return require('fs').unlinkSync(path);
    },

    writeJson: function(file, object, beautify) {
        return this.write(file, beautify ? JSON.stringify(object, null, 4) : JSON.stringify(object));
    },

    prependFile: function(file, content) {
        this.write(file, content + this.read(file));
    },

    appendFile: function(file, content) {
        var fs = require('fs'),
            fd = fs.openSync(file, 'a');

        fs.writeSync(fd, content);
        fs.closeSync(fd);
    },

    copyFile: function(src, destination, filterFn) {
        if (typeof filterFn == 'function' && filterFn(src, destination) === false) {
            return false;
        }

        var fs = require('fs'),
            path = require('path');

        if (!path.existsSync(destination)) {
            this.mkdir(path.dirname(destination));
        }

        fs.writeFileSync(destination, fs.readFileSync(src));
        fs.chmodSync(destination, fs.statSync(src).mode.toString(8).substr(-3));

        return true;
    },

    removeDirectory: function(directory) {
        var fs = require('fs'),
            path = require('path'),
            files, filePath, fileStats, i, filesLength;

        files = fs.readdirSync(directory);
        filesLength = files.length;

        if (filesLength) {
            for (i = 0; i < filesLength; i += 1) {
                filePath = path.join(directory, files[i]);

                fileStats = fs.statSync(filePath);

                if (fileStats.isFile()) {
                    fs.unlinkSync(filePath);
                }
                else if (fileStats.isDirectory()) {
                    this.removeDirectory(filePath);
                }
            }
        }

        fs.rmdirSync(directory);
    },

    copyDirectory: function(src, destination, filterFn) {
        if (typeof filterFn == 'function' && filterFn(src, destination) === false) {
            return false;
        }

        var fs = require('fs'),
            path = require('path'),
            files, file, stats, i, ln, link, srcFile, destinationFile;

        this.mkdir(destination);

        files = fs.readdirSync(src);

        for (i = 0,ln = files.length; i < ln; i++) {
            file = files[i];
            srcFile = path.join(src, file);
            destinationFile = path.join(destination, file);

            stats = fs.lstatSync(srcFile);

            if (stats.isDirectory()) {
                this.copyDirectory(srcFile, destinationFile, filterFn);
            }
            else {
                if (typeof filterFn == 'function' && filterFn(src, destination) === false) {
                    return false;
                }

                if (stats.isSymbolicLink()) {
                    try {
                        link = fs.readlinkSync(srcFile);
                        fs.symlinkSync(link, destinationFile);
                    }
                    catch (e) {}
                }
                else {
                    this.copyFile(srcFile, destinationFile);
                }
            }
        }

        return true;
    },

    checksum: function(file) {
        var hash = require('crypto').createHash('sha1');

        hash.update(this.read(file));

        return hash.digest('hex');
    },

    copy: function(src, destination, filterFn) {
        if (require('fs').statSync(src).isDirectory()) {
            return this.copyDirectory(src, destination, filterFn);
        }
        else {
            return this.copyFile(src, destination, filterFn);
        }
    }
});
