import fetchFromGitHub from '../fetch/fetchFromGitHub';
import {
	type JoplinPlugin,
	type IdToManifestRecord,
	type GlobalPluginData,
	type Stats,
	BuildConfig,
} from '../../lib/types';
import PluginRemoteInfoLoader from '../assets/PluginRemoteInfoLoader';
import CategoryGuesser from './CategoryGuesser';
import pluginDefaultCategories from './pluginDefaultCategories';
import getPluginWarnings from './getPluginWarnings';
import estimatePluginPopularity from './estimatePluginPopularity';

async function fetchPluginData(): Promise<IdToManifestRecord> {
	return await JSON.parse((await fetchFromGitHub('joplin/plugins/master/manifests.json')).result);
}

async function fetchStatsData(): Promise<Stats> {
	return await JSON.parse((await fetchFromGitHub('joplin/plugins/master/stats.json')).result);
}

function convertToDomId(id: string): string {
	return id.toLowerCase().replace(/[.]/g, '-');
}

async function getPluginData(config: BuildConfig): Promise<IdToManifestRecord> {
	const rawPlugins = await fetchPluginData();
	const rawStats = await fetchStatsData();

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
		rawPlugins[pluginId].popularity = estimatePluginPopularity(rawStats[pluginId]);

		rawPlugins[pluginId].domId = convertToDomId(pluginId);

		// Add default categories, if available
		if (pluginId in pluginDefaultCategories && !rawPlugins[pluginId].categories?.length) {
			rawPlugins[pluginId].categories = pluginDefaultCategories[pluginId];
		}
	}

	const categoryTracker = new CategoryGuesser(Object.values(rawPlugins));

	for (const pluginId in rawPlugins) {
		if (
			!Array.isArray(rawPlugins[pluginId].categories) ||
			rawPlugins[pluginId].categories?.length === 0
		) {
			rawPlugins[pluginId].categories = [categoryTracker.guessCategory(rawPlugins[pluginId])];
		}
	}

	// Load assets (may depend on categories)
	const loadRemoteInfoTasks: Array<Promise<void>> = [];
	for (const pluginId in rawPlugins) {
		const assetLoader = new PluginRemoteInfoLoader(rawPlugins[pluginId], config);

		loadRemoteInfoTasks.push(
			(async () => {
				rawPlugins[pluginId]._npm_package_maintainers = await assetLoader.loadMaintainers();
			})(),
			(async () => {
				rawPlugins[pluginId].assets = await assetLoader.loadAssets();
			})(),
		);

		rawPlugins[pluginId].warnings = getPluginWarnings(pluginId);
	}
	await Promise.all(loadRemoteInfoTasks);

	return rawPlugins;
}

export default async function getPlugins(config: BuildConfig): Promise<GlobalPluginData> {
	const plugins = await getPluginData(config);

	const all = Object.values(plugins);

	// Sort by popularity
	all.sort((a, b) => {
		return b.popularity - a.popularity;
	});

	return {
		raw: plugins,
		all,
		recommended: all.filter((plugin: JoplinPlugin) => plugin._recommended),
		trending: all.slice(0, 4),
	};
}
