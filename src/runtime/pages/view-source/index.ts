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

	const pluginInfoContainer = document.querySelector<HTMLElement>('#plugin-info')!;
	pluginInfoContainer.innerText = pluginId + ' v' + plugin.version;

	showPluginSource(outputContainer, plugins.getDownloadLink(plugin));
};

window.addEventListener('DOMContentLoaded', async () => {
	await initializeViewSourcePage();
});
