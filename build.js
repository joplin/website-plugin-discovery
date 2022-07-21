const fs = require("fs-extra");
const generateHTMLs = require("./utils/generateHTMLs.js");
const config = require("./config.js");

function clearBuildPath(buildPath){
  try {
    fs.rmSync(buildPath, { recursive: true });
  } catch (err) {
    console.log(err);
  }
}

function copyStaticFiles(buildPath){
  try {
    fs.copySync("./assets", buildPath);
  } catch (err) {
    console.log(err);
  }
}

(async function() {
  clearBuildPath(config.distDir);
  copyStaticFiles(config.distDir);
  generateHTMLs();
})();