These are the base assets for use by the `build/generate-assets.js` script. To generate new assets see the `build/README.md`.

# Adding a new framework

In order to generate the assets for a new framework, follow the steps below:

1. Add a 90 x 90 PNG framework image to the framework-icons folder. These are used to generate the framework images for the website.
2. Add a 173 x 173 PNG framework image, with a transparent background and the framework icon occupying a roughly 60 x 60 square in the top right corner. These images are used to generate the app icons for teh various mobile platforms.

Once these files have been added, follow the build instructions (located within the 'build' folder of this repository)