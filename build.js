const Eleventy = require("@11ty/eleventy");
var fs = require("fs-extra"); 
 
BUILD_PATH = "./_site";

function clearBuildPath(BUILD_PATH){
  try {
    fs.rmSync(BUILD_PATH, { recursive: true });
  } catch (err) {
    console.log(err);
  }
}

function copyStaticFiles(BUILD_PATH){
  try {
    fs.copy("./assets", BUILD_PATH);
  } catch (err) {
    console.log(err);
  }
}

(async function() {
  clearBuildPath(BUILD_PATH);
  copyStaticFiles(BUILD_PATH);
  // The first argument is the input directory. The second argument is the output directory.
  let elev = new Eleventy( "./pages", BUILD_PATH );
  await elev.write();
})();