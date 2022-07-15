# Welcome to Website Plugin

## 🚚 Project Structure

```
/
├── _data/
│   ├── data.js
│   └── data.json
├── assets/
├── pages/
│   ├── index.mustache
│   └── plugin/
├── build.js
└── package.json
```
- `_data` can be json or js. In a js file, it can be used to perform fetch from a remote API and any steps to process data locally.
- `assets` stores all static resources. It will be copied to dist folder when `yarn build` is performed.
- All `mustache` templates should be placed under `pages`.
- `build.js` is the script used to build the website.

## 💻 Commands

All commands are run from the root of the project, from a terminal:

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `yarn install`    | Installs dependencies                        |
| `yarn watch`      | Starts local dev server at `localhost:8080`  |
| `yarn build`      | Build production site to `./_site/`          |

