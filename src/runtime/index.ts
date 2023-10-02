import PluginDataManager from './PluginDataManager';
import initializeSearch from './search/initializeSearch';
import initializePluginPage from './plugin/initializePluginPage';
import initializeDownloadPage from './initializeDownloadPage';
import 'bootstrap';

import './style.scss';

// E.g. /site/ or /pluginWebsite/
const siteRoot: string = (window as any).siteRoot;

window.addEventListener('DOMContentLoaded', async () => {
	const page = (window as any).pageId ?? 'default';

	if (page === 'pluginDisplay') {
		initializePluginPage();
	}

	const pluginDataManager = await PluginDataManager.fromURL(
		`${siteRoot}/pluginData.json`,
		siteRoot,
	);

	// If initializeDownloadPage was already called
	if (page === 'download') {
		initializeDownloadPage(pluginDataManager);
	}

	initializeSearch(pluginDataManager);
});
