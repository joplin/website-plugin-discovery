import fetchFromGitHub from '../fetch/fetchFromGitHub';
import {
	type JoplinPlugin,
	type IdToManifestRecord,
	type GlobalPluginData,
	type Stats,
	BuildConfig,
} from '../../lib/types';
import PluginAssetLoader from '../assets/PluginAssetLoader';

async function fetchPluginData(): Promise<IdToManifestRecord> {
	return await JSON.parse((await fetchFromGitHub('joplin/plugins/master/manifests.json')).result);
}

async function fetchStatsData(): Promise<Stats> {
	return await JSON.parse((await fetchFromGitHub('joplin/plugins/master/stats.json')).result);
}

function convertToDomId(id: string): string {
	return id.toLowerCase().replace(/[.]/g, '-');
}

async function getTrendingPlugins(
	plugins: IdToManifestRecord,
	topn: number
): Promise<JoplinPlugin[]> {
	const result = [];
	for (const pluginId in plugins) {
		result.push({
			id: pluginId,
			downloadCount: plugins[pluginId].downloadCount,
			popularity:
				plugins[pluginId].downloadCount /
				(Date.now() - new Date(plugins[pluginId].timeModified).getTime()),
		});
	}

	return result
		.sort((a, b) => b.popularity - a.popularity)
		.slice(0, topn)
		.map((item) => {
			return {
				domId: convertToDomId(item.id),
				...plugins[item.id],
			};
		});
}

async function getPluginData(config: BuildConfig): Promise<IdToManifestRecord> {
	const rawPlugins = await fetchPluginData();
	const rawStats = await fetchStatsData();

	// Load assets
	const loadAssetTasks: Array<Promise<void>> = [];
	for (const pluginId in rawPlugins) {
		const assetLoader = new PluginAssetLoader(rawPlugins[pluginId], config);

		loadAssetTasks.push(
			(async () => {
				rawPlugins[pluginId].assets = await assetLoader.loadAssets();
			})()
		);
	}
	await Promise.all(loadAssetTasks);

	for (const pluginId in rawPlugins) {
		rawStats[pluginId] ??= {};

		if (rawStats[pluginId][rawPlugins[pluginId].version] != null) {
			rawPlugins[pluginId].downloadCount =
				rawStats[pluginId][rawPlugins[pluginId].version].downloadCount;
			rawPlugins[pluginId].timeModified =
				rawStats[pluginId][rawPlugins[pluginId].version].createdAt;
		} else {
			rawPlugins[pluginId].downloadCount = 0;
			rawPlugins[pluginId].timeModified = 'N/A';
		}
	}

	return rawPlugins;
}

export default async function getPlugins(config: BuildConfig): Promise<GlobalPluginData> {
	const plugins = await getPluginData(config);

	return {
		raw: plugins,
		all: Object.values(plugins),
		recommended: Object.values(plugins).filter((plugin: JoplinPlugin) => plugin._recommended),
		trending: await getTrendingPlugins(plugins, 3),
	};
}
