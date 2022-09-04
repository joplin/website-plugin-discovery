module.exports = function () {
	// const allPossibleCategoriesRaw = require('@joplin/lib/pluginCategories.json');

	// interface Category {
	// 	name: string
	// }

	// allPossibleCategories will be obtained from @joplin/lib in the next step
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


	const allPossibleCategories = allPossibleCategoriesRaw.map((category) => {
		return {
			name: category.toLowerCase().replace(/[ ]/g, '-'),
			displayName: category,
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
