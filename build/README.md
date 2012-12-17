[Node](http://nodejs.org) and [npm](https://npmjs.org/) is a pre-requisite of all of these processes. Before trying to run any make sure you've run -
```
[/build]> npm install magician
[/build]> npm install async
[/build]> npm install mustache
```

This will install the required packages.

###Generate CSV line-count stats

From project root, run -
```
[/]> node build/stats.js
```

###Produce website screenshot thumbnails

This process additionally requires [ImageMagick](http://www.imagemagick.org/script/binary-releases.php) on the path.

From project root, run -
```
[/]> node build/thumbnail.js
```

###Generate assets (icons and splashscreens)

This process additionally requires [ImageMagick](http://www.imagemagick.org/script/binary-releases.php) on the path.

From project root, run -
```
[/]> node build/generate-assets.js
```
