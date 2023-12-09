# Website Plugin Discovery

## 🖼️ Screenshot

![screenshot of the main page of the plugin discovery website. Lists of categories, trending, and recommended plugins are available.](https://github.com/joplin/website-plugin-discovery/assets/46334387/aeeca8d0-2801-4178-81ff-f06bde71a822)

## 🚚 Project Structure

```
/
├── build/
│   └── files related to building the website
├── lib/
│   └── Functionality common to both the build and runtime code
├── src/
│   ├── assets: Files copied to config.distDir
│   ├── components, pages: Mustache templates
│   └── runtime: Runtime scripts and styles
```


## 💻 Commands

All commands are run from the root of the project, from a terminal:

| Command                            | Action                                                                      |
| :--------------------------------- | :-------------------------------------------------------------------------- |
| `yarn install`                     | Installs dependencies                                                       |
| `yarn build`                       | Build development site to `./site/`                                         |
| `yarn watch-js`                    | Build to `./site/` and watch for runtime JS and SCSS changes.               |
| `yarn build-production <base-url>` | Build production site to `./site/` with a custom base URL (e.g. `/plugins`) |


## 🚧 Adding a plugin warning

Warning messages can be added to plugin pages by editing `build/data/getPluginWarnings.ts`.
