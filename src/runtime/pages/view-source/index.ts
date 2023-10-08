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

	for (const npmLinkContainer of document.querySelectorAll<HTMLElement>('.plugin-npm-link')) {
		const link = document.createElement('a');
		link.href = plugins.getNPMLink(plugin);

		const icon = document.createElement('i');
		icon.classList.add('fa-brands', 'fa-npm');
		icon.setAttribute('aria-label', 'NPM');

		link.replaceChildren(icon, document.createTextNode(` ${plugin._npm_package_name}`));
		npmLinkContainer.replaceChildren(link);
	}

	for (const downloadLink of document.querySelectorAll<HTMLAnchorElement>('a.plugin-jpl-link')) {
		downloadLink.href = plugins.getReleaseDownloadLink(plugin);
	}

	showPluginSource(outputContainer, plugins.getCorsDownloadLink(plugin));
};

window.addEventListener('DOMContentLoaded', async () => {
	await initializeViewSourcePage();
});
