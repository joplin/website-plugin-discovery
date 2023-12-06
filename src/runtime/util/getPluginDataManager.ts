import PluginDataManager from './PluginDataManager';

// E.g. /site/ or /pluginWebsite/
const siteRoot: string = document.querySelector<HTMLScriptElement>('#site-root')!.innerText;

// Returns an instance of the plugin data manager
const getPluginDataManager = async (): Promise<PluginDataManager> => {
	const global = window as any;

	global.pluginDataManager ??= await PluginDataManager.fromURL(
		`${siteRoot}/pluginData.json`,
		siteRoot,
	);

	return global.pluginDataManager;
};

export default getPluginDataManager;
