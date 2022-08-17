"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const config = require("./config.json");
// const klawSync = require('klaw-sync');
const Mustache = require('mustache');
const path = require('node:path');
const klaw_sync_1 = __importDefault(require("klaw-sync"));
function clearBuildPath(buildPath) {
    try {
        fs.rmSync(buildPath, { recursive: true });
    }
    catch (err) {
        console.log(err);
    }
}
function copyStaticFiles(buildPath) {
    try {
        fs.copySync("./assets", buildPath);
    }
    catch (err) {
        console.log(err);
    }
}
function loadData() {
    const dataFiles = (0, klaw_sync_1.default)('./data', { nodir: true });
    const data = {};
    dataFiles.forEach((file) => {
        let dataItem = require(file.path);
        data[path.basename(file.path, '.js')] = dataItem();
    });
    return data;
}
function loadTemplate() {
    const templateFiles = (0, klaw_sync_1.default)('./pages', { nodir: true });
    return templateFiles.map(file => {
        return {
            name: path.basename(file.path, '.mustache'),
            path: path.parse(file.path).dir,
            content: fs.readFileSync(file.path, 'utf8')
        };
    });
}
function renderTemplates(templates, data) {
    templates.forEach(template => {
        const distPath = path.join(path.resolve(config.distDir), path.relative(config.rootDir, template.path).replace('pages', ''), template.name + '.html');
        console.log(`Rendering ${distPath}`);
        const output = Mustache.render(template.content, data);
        fs.mkdirsSync(path.dirname(distPath));
        fs.writeFileSync(distPath, output, 'utf8');
    });
}
(function () {
    clearBuildPath(config.distDir);
    copyStaticFiles(config.distDir);
    const template = loadTemplate();
    const data = loadData();
    renderTemplates(template, data);
})();
