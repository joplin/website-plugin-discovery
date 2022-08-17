const fs = require("fs-extra");
const config = require("./config.json");
// const klawSync = require('klaw-sync');
const Mustache = require('mustache');
const path = require('node:path');

import klawSync from 'klaw-sync';

interface Template {
  path: string; 
  name: string; 
  content: string;
}

interface Data {
  [key: string]: any;
}

function clearBuildPath(buildPath: string){
  try {
    fs.rmSync(buildPath, { recursive: true });
  } catch (err) {
    console.log(err);
  }
}

function copyStaticFiles(buildPath: string){
  try {
    fs.copySync("./assets", buildPath);
  } catch (err) {
    console.log(err);
  }
}

function loadData(): Data{
  const dataFiles = klawSync('./data', {nodir: true});
  const data: Data = {};
  dataFiles.forEach((file) => {
    let dataItem = require(file.path);
    data[path.basename(file.path, '.js')] = dataItem();
  })
  return data;
}

function loadTemplate(): Template[]{
  const templateFiles = klawSync('./pages', {nodir: true});
  return templateFiles.map(file => {
    return {
      name: path.basename(file.path, '.mustache'),
      path: path.parse(file.path).dir,
      content: fs.readFileSync(file.path, 'utf8')
    }
  });
}

function renderTemplates(templates: Template[], data: Data){
  templates.forEach(template => {
    const distPath = path.join(path.resolve(config.distDir), path.relative(config.rootDir, template.path).replace('pages', ''), template.name + '.html');
    console.log(`Rendering ${distPath}`);
    const output = Mustache.render(template.content, data)
    fs.mkdirsSync(path.dirname(distPath));
    fs.writeFileSync(distPath, output, 'utf8');
  });
}

(function() {
  clearBuildPath(config.distDir);
  copyStaticFiles(config.distDir);
  const template = loadTemplate();
  const data = loadData();
  renderTemplates(template, data);
})();