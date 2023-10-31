import { Categories } from './Categories';

const pluginDefaultCategories: Record<string, string[]> = {
	'plugin.calebjohn.rich-markdown': [Categories.Productivity],
	'io.github.jackgruber.backup': [Categories.Files, Categories.Productivity],
	'joplin.plugin.note.tabs': [Categories.Productivity, Categories.Search],
	'joplin.plugin.templates': [Categories.Editor, Categories.Productivity],
	'com.whatever.quick-links': [Categories.Editor, Categories.Productivity],
	'com.github.joplin.kanban': [Categories.PersonalKnowledgeManagement],
	'joplin.plugin.benji.favorites': [Categories.PersonalKnowledgeManagement, Categories.Search],
	'plugin.calebjohn.MathMode': [Categories.Integrations, Categories.Editor],
	'net.rmusin.joplin-table-formatter': [
		Categories.Productivity,
		Categories.Editor,
		Categories.Appearance,
	],
	'com.whatever.inline-tags': [Categories.Tags],
	'cx.evermeet.tessus.menu-shortcut-toolbar': [Categories.Productivity, Categories.Editor],
	'io.github.jackgruber.note-overview': [Categories.Search, Categories.Productivity],
	'joplin-plugin-conflict-resolution': [
		Categories.Editor,
		Categories.Productivity,
		Categories.Integrations,
	],
	'io.github.jackgruber.hotfolder': [Categories.Files],
	'org.joplinapp.plugins.ToggleSidebars': [
		Categories.Productivity,
		Categories.Editor,
		Categories.Viewer,
	],
	'io.github.jackgruber.combine-notes': [Categories.Editor, Categories.Productivity],
};

export default pluginDefaultCategories;
