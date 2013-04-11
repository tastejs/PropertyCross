/**
 * Sencha Blink - Development
 * @author Jacky Nguyen <jacky@sencha.com>
 */
(function() {
    function write(content) {
        document.write(content);
    }

    function meta(name, content) {
        write('<meta name="' + name + '" content="' + content + '">');
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'app.json', false);
    xhr.send(null);

    var options = eval("(" + xhr.responseText + ")"),
        scripts = options.js || [],
        styleSheets = options.css || [],
        i, ln, path;

    meta('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no');
    meta('apple-mobile-web-app-capable', 'yes');
    meta('apple-touch-fullscreen', 'yes');

    for (i = 0,ln = styleSheets.length; i < ln; i++) {
        path = styleSheets[i];

        if (typeof path != 'string') {
            path = path.path;
        }

        write('<link rel="stylesheet" href="'+path+'">');
    }

    for (i = 0,ln = scripts.length; i < ln; i++) {
        path = scripts[i];

        if (typeof path != 'string') {
            path = path.path;
        }

        write('<script src="'+path+'"></'+'script>');
    }

})();
