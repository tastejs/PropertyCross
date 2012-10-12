{
    /**
     * The application's namespace, used by Sencha Command to generate classes
     */
    "name": "{name}",

    /**
     * The file path to this application's front HTML document, relative to this app.json file
     */
    "indexHtmlPath": "index.html",

    /**
     * The absolute URL to this application in development environment, i.e: the URL to run this application
     * on your web browser during development, e.g: "http://localhost/myapp/index.html".
     *
     * This value is needed when build to resolve your application's dependencies if it requires server-side resources
     * that are not accessible via file system protocol.
     */
    "url": null,

    /**
     * List of all JavaScript assets in the right execution order.
     * Each item is an object with the following format:
     *      {
     *          "path": "path/to/script.js" // Relative path to this app.json file
     *          "update": "delta"           // (Optional)
     *                                      //  - If not specified, this file will only be loaded once, and
     *                                      //    cached inside localStorage until this value is changed.
     *                                      //  - "delta" to enable over-the-air delta update for this file
     *                                      //  - "full" means full update will be made when this file changes
     *
     *      {[ "\}"]}
     */
    "js": [
        {
            "path": "sdk/sencha-touch<tpl if="library == 'all'">-all</tpl>.js"
        {[ "\}"]},
        {
            "path": "app.js",
            "bundle": true,  /* Indicates that all class dependencies are concatenated into this file when build */
            "update": "delta"
        {[ "\}"]}
    ],

    /**
     * List of all CSS assets in the right inclusion order.
     * Each item is an object with the following format:
     *      {
     *          "path": "path/to/item.css" // Relative path to this app.json file
     *          "update": "delta"          // (Optional)
     *                                     //  - If not specified, this file will only be loaded once, and
     *                                     //    cached inside localStorage until this value is changed to either one below
     *                                     //  - "delta" to enable over-the-air delta update for this file
     *                                     //  - "full" means full update will be made when this file changes
     *
     *      {[ "\}"]}
     */
    "css": [
        {
            "path": "resources/css/app.css",
            "update": "delta"
        {[ "\}"]}
    ],

    /**
     * Used to automatically generate cache.manifest (HTML 5 application cache manifest) file when you build
     */
    "appCache": {
        /**
         * List of items in the CACHE MANIFEST section
         */
        "cache": [
            "index.html"
        ],
        /**
         * List of items in the NETWORK section
         */
        "network": [
            "*"
        ],
        /**
         * List of items in the FALLBACK section
         */
        "fallback": []
    {[ "\}"]},

    /**
     * Extra resources to be copied along when build
     */
    "resources": [
        "resources/images",
        "resources/icons",
        "resources/startup"
    ],

    /**
     * File / directory name matchers to ignore when copying to the builds, must be valid regular expressions
     */
    "ignore": [
        "\\.svn$"
    ],

    /**
     * Directory path to store all previous production builds. Note that the content generated inside this directory
     * must be kept intact for proper generation of deltas between updates
     */
    "archivePath": "archive",

    /**
     * Default paths to build this application to for each environment
     */
    "buildPaths": {
        "testing": "build/testing",
        "production": "build/production",
        "package": "build/package",
        "native": "build/native"
    {[ "\}"]},

    /**
     * Build options
     */
    "buildOptions": {
        "product": "touch",
        "minVersion": 3,
        "debug": false,
        "logger": "no"
    {[ "\}"]},

    /**
     * Uniquely generated id for this application, used as prefix for localStorage keys.
     * Normally you should never change this value.
     */
    "id": "{uniqueId}"
{[ "\}"]}
