import getPluginDataManager from '../util/getPluginDataManager';
import getURLData from '../util/getURLData';

const initializeBreadcrumbs = async () => {
	const urlData = getURLData(location.href);

	// Update the nav links to include one of the plugin's tags
	const parentTagLink = document.querySelector<HTMLAnchorElement>('a#current-category-nav-link');

	// Only fill conditionally -- not all pages have breadcrumbs links
	if (parentTagLink && urlData.fromTab) {
		parentTagLink.innerText = urlData.fromTab.replace(/-/g, ' ');
		parentTagLink.href += `#tab-${urlData.fromTab.replace(/[^a-zA-Z0-9]/g, '-')}`;
	}

	const currentPluginLink = document.querySelector<HTMLAnchorElement>('a#current-plugin-nav-link');
	if (currentPluginLink && urlData.pluginId) {
		const pluginDataManager = await getPluginDataManager();
		const plugin = pluginDataManager.pluginFromId(urlData.pluginId);

		if (!plugin) {
			currentPluginLink.classList.add('invalid');
			currentPluginLink.innerText = 'Unknown';
		} else {
			currentPluginLink.innerText = plugin.name;

			// Send the parent tab to the plugin page
			const fromTabSpecifier = urlData.fromTab ? `?from-tab=${urlData.fromTab}` : '';
			currentPluginLink.href = pluginDataManager.getLinkToPlugin(plugin) + fromTabSpecifier;
		}
	}

	// To make the category breadcrumb work, some links need to be updated
	if (urlData.fromTab) {
		const linksToUpdate = document.querySelectorAll<HTMLAnchorElement>(
			'a.process--append-parent-tab-to-href',
		);

		for (const link of linksToUpdate) {
			link.href += '?from-tab=' + urlData.fromTab;
		}
	}
};

export default initializeBreadcrumbs;
