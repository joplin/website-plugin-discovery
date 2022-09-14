async function fetchPluginData(): Promise<any> {
	let plugins = []
	const mirrors = [
		'https://raw.githubusercontent.com/joplin/plugins/master/manifests.json',
		'https://raw.staticdn.net/joplin/plugins/master/manifests.json',
		'https://raw.fastgit.org/joplin/plugins/master/manifests.json',
	]
	for (let index = 0; index < mirrors.length; index++) {
		try {
			plugins = await (await fetch(mirrors[index])).json()
			return plugins
		} catch (error) {
			continue
		}
	}
	throw new Error('Cannot find avalible Github mirror')
}

function convertToDomId(id: string): string {
	return id.toLowerCase().replace(/[.]/g, '-')
}

async function getTrendingPlugins(plugins: any, topn: number): Promise<any> {
	const result = []
	for (const pluginId in plugins) {
		result.push({
			id: pluginId,
			downloadCount: plugins[pluginId].downloadCount,
		})
	}

	return result
		.sort((a, b) => b.downloadCount - a.downloadCount)
		.slice(0, topn)
		.map((item) => {
			return {
				domId: convertToDomId(item.id),
				...plugins[item.id],
			}
		})
}

async function getPluginData(): Promise<any> {
	const period = 'last-week'

	const rawPlugins = await fetchPluginData()
	for (const pluginId in rawPlugins) {
		const packageName: string = rawPlugins[pluginId]._npm_package_name
		const downloadStat: { downloads: number } = await (
			await fetch(
				`https://api.npmjs.org/downloads/point/${period}/${packageName}`
			)
		).json()
		const registry = await (
			await fetch(`https://registry.npmjs.org/${packageName}`)
		).json()

		rawPlugins[pluginId].downloadCount = downloadStat.downloads
		rawPlugins[pluginId].timeModified = registry.time.modified
	}

	return rawPlugins
}

export default async function getPlugins(): Promise<{
	raw: any
	all: any[]
	trending: any[]
	recommended: any[]
}> {
	const plugins = await getPluginData()

	return {
		raw: plugins,
		all: Object.values(plugins),
		recommended: Object.values(plugins).filter(
			(plugin: any) => plugin._recommended
		),
		trending: await getTrendingPlugins(plugins, 3),
	}
}
