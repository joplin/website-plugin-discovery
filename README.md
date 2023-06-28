# Welcome to Website Plugin

## 🖼️ Screenshot

![screenshot of the main page of the plugin discovery website. Lists of categories, trending, and recommended plugins are available.](https://github.com/joplin/website-plugin-discovery/assets/46334387/aeeca8d0-2801-4178-81ff-f06bde71a822)

## 🚚 Project Structure

```
/
├── data/
│   └── data.js
├── assets/
├── pages/
│   ├── index.mustache
│   └── plugin/
├── components/
│   └── component.mustache
├── build.js
├── config.ts
└── package.json
```

- `data` should be a js script. It can be used to perform fetch from a remote API and any steps to process data locally.
- `assets` stores all static resources. It will be copied to dist folder when `yarn build` is performed.
- All `mustache` templates should be placed under `pages`.
- `components` is where all mustache partials lie. It will be loaded automatically when built.
- `config.ts` is the config file includes global vars such as `distDir`.
- `build.js` is the script used to build the website.

## 💻 Commands

All commands are run from the root of the project, from a terminal:

| Command        | Action                                         |
| :------------- | :--------------------------------------------- |
| `yarn install` | Installs dependencies                          |
| `yarn build`   | Build production site to `./{config.distDir}/` |
