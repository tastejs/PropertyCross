# Website Build Instructions

The website is hosted using the GitHub Pages feature, a rebased squashed version of this folder is hosted at the root of the gh-pages branch.

To rebuild the less run -
```
website> npm install -g less
website> lessc --yui-compress less/main.less > less/main.css
website> git commit -a -m "Update compiled css"
```

To push the website folder to the gh-pages branch -
```
> git update-ref refs/heads/gh-pages `git commit-tree master:website -m "Update website"`
> git push upstream gh-pages:gh-pages
```

The push will need to be forced as it won't be a fast forward commit (we're throwing away all history).

The downloads are hosted separately on AWS S3, ask [chrisprice](http://github.com/chrisprice) if you need them updating. Following the initial upload of files (which are suffixed with -initial), subsequent uploads should be suffixed with the SHA1 hash of the commit from which they are generated.
