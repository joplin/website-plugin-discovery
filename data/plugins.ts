export interface Manifest {
	[id: string]: JoplinPlugin
}

export interface Stats {
	[id: string]: any
}

export interface JoplinPlugin {
	manifest_version: number
	id: string
	app_min_version: string
	version: string
	name: string
	description: string
	author: string
	homepage_url: string
	repository_url: string
	keywords: string[]
	categories: string[]
	_publish_hash: string
	_publish_commit: string
	_npm_package_name: string
	_recommended: boolean
	downloadCount: number
	timeModified: string
	domId?: string
}

async function fetchPluginData(): Promise<Manifest> {
	let plugins
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

async function fetchStatsData(): Promise<Stats> {
	let stats
	const mirrors = [
		'https://raw.githubusercontent.com/joplin/plugins/master/stats.json',
		'https://raw.staticdn.net/joplin/plugins/master/stats.json',
		'https://raw.fastgit.org/joplin/plugins/master/stats.json',
	]
	for (let index = 0; index < mirrors.length; index++) {
		try {
			stats = await (await fetch(mirrors[index])).json()
			return stats
		} catch (error) {
			continue
		}
	}
	throw new Error('Cannot find avalible Github mirror')
}

function convertToDomId(id: string): string {
	return id.toLowerCase().replace(/[.]/g, '-')
}

async function getTrendingPlugins(
	plugins: Manifest,
	topn: number
): Promise<JoplinPlugin[]> {
	const result = []
	for (const pluginId in plugins) {
		result.push({
			id: pluginId,
			downloadCount: plugins[pluginId].downloadCount,
			popularity: plugins[pluginId].downloadCount / (Date.now() - new Date(plugins[pluginId].timeModified).getTime()),
		})
	}

	return result
		.sort((a, b) => b.popularity - a.popularity)
		.slice(0, topn)
		.map((item) => {
			return {
				domId: convertToDomId(item.id),
				...plugins[item.id],
			}
		})
}

async function getPluginData(): Promise<Manifest> {

	const rawPlugins = await fetchPluginData()
	const rawStats = await fetchStatsData()

	for (const pluginId in rawPlugins) {
		if (rawStats[pluginId][rawPlugins[pluginId].version] != null) {
			rawPlugins[pluginId].downloadCount = rawStats[pluginId][rawPlugins[pluginId].version].downloadCount
			rawPlugins[pluginId].timeModified = rawStats[pluginId][rawPlugins[pluginId].version].createdAt	
		} else {
			rawPlugins[pluginId].downloadCount = 0
			rawPlugins[pluginId].timeModified = "N/A"
		}
	}

	return rawPlugins
}

export default async function getPlugins(): Promise<{
	raw: Manifest
	all: JoplinPlugin[]
	trending: JoplinPlugin[]
	recommended: JoplinPlugin[]
}> {
	const plugins = await getPluginData()

	return {
		raw: plugins,
		all: Object.values(plugins),
		recommended: Object.values(plugins).filter(
			(plugin: JoplinPlugin) => plugin._recommended
		),
		trending: await getTrendingPlugins(plugins, 3),
	}
}
