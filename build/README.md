[Node](http://nodejs.org) and [npm](https://npmjs.org/) is a pre-requisite of all of these processes. Before trying to run any make sure you've run -
```
[/build]> npm install
```

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
