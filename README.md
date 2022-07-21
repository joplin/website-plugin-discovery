# Welcome to Website Plugin

## 🚚 Project Structure

```
/
├── data/
│   └── data.js
├── assets/
├── pages/
│   ├── index.mustache
│   └── plugin/
├── build.js
├── config.js
└── package.json
```
- `data` should be a js script. It can be used to perform fetch from a remote API and any steps to process data locally.
- `assets` stores all static resources. It will be copied to dist folder when `yarn build` is performed.
- All `mustache` templates should be placed under `pages`.
- `config.js` is the config file includes global vars such as `distDir`.
- `build.js` is the script used to build the website.

## 💻 Commands

All commands are run from the root of the project, from a terminal:

| Command           | Action                                         |
| :---------------- | :--------------------------------------------- |
| `yarn install`    | Installs dependencies                          |
| `yarn build`      | Build production site to `./{config.distDir}/` |

