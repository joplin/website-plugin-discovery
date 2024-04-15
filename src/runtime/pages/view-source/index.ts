import { JoplinPlugin } from '../../../../lib/types';
import PluginDataManager from '../../util/PluginDataManager';
import getPluginDataManager from '../../util/getPluginDataManager';
import showPluginSource from './showPluginSource';

const getProvenanceAlert = () => document.querySelector<HTMLElement>('.verified-provenance-alert');

const initializeDragAndDrop = (
	outputContainer: HTMLElement,
	pluginSource: ReturnType<typeof showPluginSource>,
) => {
	outputContainer.ondragover = (event) => {
		event.preventDefault();
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'move';
		}
	};

	const pluginInfoArea = document.querySelector<HTMLElement>('.plugin-info');
	const pluginInfoAlert = document.querySelector<HTMLElement>('.plugin-info-alert');
	const pluginProvenanceAlert = getProvenanceAlert();
	outputContainer.ondrop = async (event) => {
		event.preventDefault();
		if (event.dataTransfer) {
			for (const file of event.dataTransfer.files) {
				if (file.name.endsWith('.jpl')) {
					(await pluginSource)?.remove();

					// Hide/update information that likely references the previous plugin.
					if (pluginInfoArea) {
						pluginInfoArea.innerText = `Loaded from file: ${file.name}`;
					}
					pluginProvenanceAlert?.remove();
					pluginInfoAlert?.remove();

					pluginSource = showPluginSource(outputContainer, file);
					return;
				}
			}
		}
	};
};

const initializeProvenanceAlert = (plugins: PluginDataManager, plugin: JoplinPlugin) => {
	const pluginProvenanceAlert = getProvenanceAlert();
	if (pluginProvenanceAlert && plugin.provenance) {
		pluginProvenanceAlert.style.display = 'block';
		plugins.getProvenanceDetailsLink;
	}
};

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

	for (const provenanceLink of document.querySelectorAll<HTMLAnchorElement>(
		'a.plugin-provenance-link',
	)) {
		if (!plugin.provenance) {
			provenanceLink.innerText = '[[No provenance]]';
		}
		provenanceLink.href = plugins.getProvenanceDetailsLink(plugin);
	}

	for (const downloadLink of document.querySelectorAll<HTMLAnchorElement>('a.plugin-jpl-link')) {
		downloadLink.href = plugins.getReleaseDownloadLink(plugin);
	}

	const pluginSource = showPluginSource(outputContainer, plugins.getCorsDownloadLink(plugin));
	initializeDragAndDrop(outputContainer, pluginSource);
	initializeProvenanceAlert(plugins, plugin);
};

window.addEventListener('DOMContentLoaded', async () => {
	await initializeViewSourcePage();
});
