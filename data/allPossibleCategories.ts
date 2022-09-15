import getPlugins, { JoplinPlugin } from './plugins'

export interface Category {
	name: string
	displayName: string
	plugins: JoplinPlugin[]
}

export default async function getAllPossibleCategories(): Promise<Category[]> {
	// allPossibleCategories will be obtained from @joplin/lib in the next step
	// "@joplin/lib": "~2.9",
	// const allPossibleCategoriesRaw = require('@joplin/lib/pluginCategories.json');
	const allPossibleCategoriesRaw = [
		'Appearance',
		'Developer Tools',
		'Productivity',
		'Themes',
		'Integrations',
		'Viewer',
		'Search',
		'Tags',
		'Editor',
		'Files',
		'Personal Knowledge Management',
	]

	const plugins = await getPlugins()
	const allPossibleCategories = allPossibleCategoriesRaw.map((category) => {
		return {
			name: category.toLowerCase().replace(/[\s]/g, '-'),
			displayName: category,
			plugins: plugins.all.filter(
				(plugin: JoplinPlugin) =>
					Boolean(plugin.categories) &&
					plugin.categories.includes(category.toLowerCase())
			),
		}
	})
	// const allPossibleCategories = allPossibleCategoriesRaw.map((category: Category) => {
	// 	return {
	// 		name: category.name.replace(/[ ]/g, '-'),
	// 		displayName: category,
	// 	}
	// })
	return allPossibleCategories
}
