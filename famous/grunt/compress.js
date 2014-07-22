// Compresses files to places other tasks can us
module.exports = {
  main: {
    options: {
      archive: "app.zip",
      mode: "zip"
    },
    files: [
      { expand: true, src: ["**/*"], cwd: "build", dest: "www" },
      { expand: true, src: ["**/*"], cwd: "app", dest: "www" }
    ]
  }
};
