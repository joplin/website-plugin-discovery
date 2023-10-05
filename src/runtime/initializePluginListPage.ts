import { Tab } from 'bootstrap';

const initTabNavigation = () => {
	const tabContainer = document.querySelector('nav#nav-tab')!;
	const breadcrumbCurrentTab = document.querySelector<HTMLElement>('#active-tab-breadcrumb')!;

	let ignoreNextHashChange = false;

	// Create all tabs
	for (const tabTrigger of tabContainer.querySelectorAll<HTMLElement>('[role=tab]')) {
		new Tab(tabTrigger);

		tabTrigger.addEventListener('shown.bs.tab', () => {
			const currentTabHash = tabTrigger.getAttribute('href')!;

			if (location.hash !== currentTabHash) {
				// Ignore the next hash change (avoids tab switching
				// as a result of changing the hash).
				ignoreNextHashChange = true;
				location.hash = currentTabHash;
			}

			breadcrumbCurrentTab.innerText = tabTrigger.innerText;
		});
	}

	const navigateToTabFromHash = (url: string) => {
		const selectedTabMatch = url.match(/#tab-([a-zA-Z0-9\-_]+)$/);
		const tabName = selectedTabMatch ? selectedTabMatch[1] : 'all';

		const tabButton = tabContainer.querySelector(`#nav-${tabName}-tab`);

		if (tabButton) {
			Tab.getOrCreateInstance(tabButton).show();
		}
	};
	navigateToTabFromHash(location.href);

	window.addEventListener('hashchange', (event) => {
		if (ignoreNextHashChange) {
			ignoreNextHashChange = false;
			return;
		}

		navigateToTabFromHash(event.newURL);
	});
};

const initializePluginListPage = () => {
	initTabNavigation();

	// Initialize plugin cards
	const tabPanes = document.querySelectorAll('.tab-pane');
	for (const tabPane of tabPanes) {
		const tabName = tabPane.getAttribute('data-tab-name');

		if (!tabName) {
			console.error('A tab is missing the data-tab-name attribute!');
			continue;
		}

		const pluginCardLinks = tabPane.querySelectorAll<HTMLAnchorElement>('a.plugin-link-card');
		for (const link of pluginCardLinks) {
			link.href += `?from-tab=${tabName}`;
		}
	}
};

export default initializePluginListPage;
