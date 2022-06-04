# Webiste Plugin Discovery
## Introduction
Webiste Plugin Discovery is designed to help Joplin users to find the plugins they want. There are two main pages: Home Page and Plugin Detail Page.
### Home Page
The homepage contains 4 major parts: Recommended Plugins, Trending Plugins, a search box, and a plugin list separated into categories.

Recommended plugins can be selected manually in a JSON file. Trending plugins are auto-generated from stats.json using the download count.

The search feature can be implemented with 3rd party libs such as js-search. We can search the field name, description, and keyword through manifests.json.

The plugin list should display all the plugins in manifests.json and separate them into groups according to their plugin type.
### Detail Page
The detail page `joplinapp.org/plugins/[plugin name]` includes information about a specific plugin which are basic plugin information, screenshots, and plugin documentations.

Basic plugin information contains the information fetched from manifests.json. And it should be displayed in a list format.

Screenshots are optional, if there are any screenshots or gifs in the plugin’s readme file, we can demonstrate them in the screenshots section to give the users an overall impression.

Plugin documentation can be rendered from the plugin’s readme file. It might contain what does the plugin do, how-tos, and release notes.

The interactive features such as comments and ratings can be done using Github issues (or gist) and Github APIs as the backend. When a user opened the page, it use ajax to get data from Github issues through Github APIs and render the comments and ratings dynamically on the page. As the user posts a comment or rating, the page uses ajax to update the data stored in Github issues in real-time.
