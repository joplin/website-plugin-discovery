import PluginDataManager from './PluginDataManager';
import initializeSearch from './initializeSearch';

// E.g. /site/ or /pluginWebsite/
const siteRoot: string = (window as any).siteRoot;

void (async () => {
	initializeSearch(
		await PluginDataManager.fromURL(`${siteRoot}/pluginData.json`),
		document.querySelector('#search-input')!,
		document.querySelector('#search-results-container')!
	);
})();
