import getPluginDataManager from '../../util/getPluginDataManager';
import showPluginSource from './showPluginSource';

const initializeViewSourcePage = async () => {
	const plugins = await getPluginDataManager();
	const outputContainer = document.querySelector<HTMLElement>('#view-source-output')!;

	const pluginNameMatch = /[?]plugin=([^,?/#]+)/.exec(location.href);
	if (!pluginNameMatch) {
		outputContainer.innerText = 'Invalid URL. Should end with ?plugin=some.plugin.id';
		return;
	}

	const pluginId = pluginNameMatch[1];
	const plugin = plugins.pluginFromId(pluginId);

	if (!plugin) {
		outputContainer.innerText = 'Invalid plugin ID ' + pluginId;
		return;
	}

	// Fill elements in the HTML with information about the plugin
	for (const pluginIdElem of document.querySelectorAll<HTMLElement>('.plugin-id')) {
		pluginIdElem.innerText = pluginId;
	}

	for (const pluginVersionElem of document.querySelectorAll<HTMLElement>('.plugin-version')) {
		pluginVersionElem.innerText = plugin.version;
	}

	for (const pluginNameElem of document.querySelectorAll<HTMLElement>('.plugin-name')) {
		pluginNameElem.innerText = plugin.name;
	}

	for (const downloadLink of document.querySelectorAll<HTMLAnchorElement>('a.plugin-jpl-link')) {
		downloadLink.href = plugins.getReleaseDownloadLink(plugin);
	}

	showPluginSource(outputContainer, plugins.getCorsDownloadLink(plugin));
};

window.addEventListener('DOMContentLoaded', async () => {
	await initializeViewSourcePage();
});
