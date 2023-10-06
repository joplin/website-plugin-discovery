import PluginDataManager from '../PluginDataManager';
import showPluginSource from './showPluginSource';

const initializeViewSourcePage = (plugins: PluginDataManager) => {
	const outputContainer = document.querySelector<HTMLElement>('#view-source-output')!;

	const pluginNameMatch = /[?]plugin=([^,?/]+)/.exec(location.href);
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

	showPluginSource(outputContainer, plugins.getDownloadLink(plugin));
};

export default initializeViewSourcePage;
