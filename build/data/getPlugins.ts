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

const getPluginPopularity = (plugin: JoplinPlugin) => {
	return plugin.downloadCount / (Date.now() - new Date(plugin.timeModified).getTime());
};

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
			})(),
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

		rawPlugins[pluginId].domId = convertToDomId(pluginId);
	}

	return rawPlugins;
}

export default async function getPlugins(config: BuildConfig): Promise<GlobalPluginData> {
	const plugins = await getPluginData(config);

	const all = Object.values(plugins);

	// Sort by popularity
	all.sort((a, b) => {
		return getPluginPopularity(b) - getPluginPopularity(a);
	});

	return {
		raw: plugins,
		all,
		recommended: all.filter((plugin: JoplinPlugin) => plugin._recommended),
		trending: all.slice(0, 4),
	};
}
