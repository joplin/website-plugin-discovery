export interface Manifest {
	[id: string]: JoplinPlugin
}

export interface JoplinPlugin {
	manifest_version: number,
	id: string,
	app_min_version: string,
	version: string,
	name: string,
	description: string,
	author: string,
	homepage_url: string,
	repository_url: string,
	keywords: string[],
	categories: string[],
	_publish_hash: string,
	_publish_commit: string,
	_npm_package_name: string,
	_recommended: boolean,
	downloadCount: number,
	timeModified: string,
	domId?: string,
}

async function fetchPluginData(): Promise<Manifest> {
	let plugins;
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

async function getTrendingPlugins(plugins: Manifest, topn: number): Promise<JoplinPlugin[]> {
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

async function getPluginData(): Promise<Manifest> {
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
