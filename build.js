"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mustache_1 = __importDefault(require("mustache"));
const node_path_1 = __importDefault(require("node:path"));
const klaw_sync_1 = __importDefault(require("klaw-sync"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const config = require("./config.json");
function clearBuildPath(buildPath) {
    try {
        fs_extra_1.default.rmSync(buildPath, { recursive: true });
    }
    catch (err) {
        console.log(err);
    }
}
function copyStaticFiles(buildPath) {
    try {
        fs_extra_1.default.copySync("./assets", buildPath);
    }
    catch (err) {
        console.log(err);
    }
}
function loadData() {
    const dataFiles = (0, klaw_sync_1.default)("./data", { nodir: true });
    const data = {};
    dataFiles.forEach((file) => {
        let dataItem = require(file.path);
        data[node_path_1.default.basename(file.path, ".js")] = dataItem();
    });
    return data;
}
function loadTemplate() {
    const templateFiles = (0, klaw_sync_1.default)("./pages", { nodir: true });
    return templateFiles.map((file) => {
        return {
            name: node_path_1.default.basename(file.path, ".mustache"),
            path: node_path_1.default.parse(file.path).dir,
            content: fs_extra_1.default.readFileSync(file.path, "utf8"),
        };
    });
}
function renderTemplates(templates, data) {
    templates.forEach((template) => {
        const distPath = node_path_1.default.join(node_path_1.default.resolve(config.distDir), node_path_1.default.relative(config.rootDir, template.path).replace("pages", ""), template.name + ".html");
        console.log(`Rendering ${distPath}`);
        const output = mustache_1.default.render(template.content, data);
        fs_extra_1.default.mkdirsSync(node_path_1.default.dirname(distPath));
        fs_extra_1.default.writeFileSync(distPath, output, "utf8");
    });
}
(function () {
    clearBuildPath(config.distDir);
    copyStaticFiles(config.distDir);
    const template = loadTemplate();
    const data = loadData();
    renderTemplates(template, data);
})();
