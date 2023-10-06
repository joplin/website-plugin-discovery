import PluginDataManager from './PluginDataManager';

// E.g. /site/ or /pluginWebsite/
const siteRoot: string = (window as any).siteRoot;

// Returns an instance of the plugin data manager
const getPluginDataManager = async () => {
	const global = window as any;

	global.pluginDataManager ??= await PluginDataManager.fromURL(
		`${siteRoot}/pluginData.json`,
		siteRoot,
	);

	return global.pluginDataManager;
};

export default getPluginDataManager;
