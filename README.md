# Website Plugin

##  Project Structure

Inside of the project, you'll see the following folders and files:

```
/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

Any static assets, like images, can be placed in the `public/` directory.

## Commands

All commands are run from the root of the project, from a terminal:

| Command            | Action                                       |
| :----------------- | :------------------------------------------- |
| `yarn install`     | Installs dependencies                        |
| `yarn run dev`     | Starts local dev server at `localhost:3000`  |
| `yarn run build`   | Build production site to `./dist/`           |
| `yarn run preview` | Preview build locally, before deploying      |

