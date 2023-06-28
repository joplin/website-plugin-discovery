import { JoplinPlugin } from '../lib/types';
import PluginDataManager from './PluginDataManager';

// Client-side JavaScript for the downloadPlugin.html page.
// Assumes that the plugin ID is specified in the URL.
const initializeDownloadPage = (dataManager: PluginDataManager) => {
	// Find elements with content that needs to be replaced
	const downloadJPLLinks = document.querySelectorAll('a#plugin-download-link');
	const pluginTitleRegions = document.querySelectorAll('#plugin-title');

	// Get the plugin ID from the URL:
	const pluginIdMatch = /[?]id=(.*)$/.exec(location.href);
	let plugin: JoplinPlugin | null = null;
	let pluginId: string | null = null;
	if (pluginIdMatch) {
		// 1: First capture group
		pluginId = pluginIdMatch[1];

		plugin = dataManager.pluginFromId(pluginId);
	}

	if (!plugin) {
		console.warn('Invalid plugin ID.');
	}

	const errorInvalidIdMessage = 'Error: Invalid plugin ID, ' + pluginId;

	for (const link of downloadJPLLinks) {
		if (plugin) {
			const id = plugin.id;
			const version = plugin.version ?? 0;
			const href = `https://github.com/joplin/plugins/releases/download/plugins/${id}@${version}.jpl`;
			link.setAttribute('href', href);
		} else {
			(link as HTMLLinkElement).innerText = errorInvalidIdMessage;
		}
	}

	for (const titleElem of pluginTitleRegions) {
		let nameText = errorInvalidIdMessage;
		if (plugin) {
			nameText = plugin.name;
		}

		titleElem.replaceChildren(document.createTextNode(nameText));
	}
};

export default initializeDownloadPage;
