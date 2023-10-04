import { Tab } from 'bootstrap';

const initializePluginListPage = () => {
	const tabContainer = document.querySelector('nav#nav-tab')!;

	let ignoreNextHashChange = false;

	// Create all tabs
	for (const tabTrigger of tabContainer.querySelectorAll('[role=tab]')) {
		new Tab(tabTrigger);

		tabTrigger.addEventListener('shown.bs.tab', () => {
			const currentTabHash = tabTrigger.getAttribute('href')!;

			if (location.hash !== currentTabHash) {
				// Ignore the next hash change (avoids tab switching
				// as a result of changing the hash).
				ignoreNextHashChange = true;
				location.hash = currentTabHash;
			}
		});
	}

	const navigateToTabFromHash = (url: string) => {
		const selectedTabMatch = url.match(/#tab-([a-zA-Z0-9\-_]+)$/);
		if (selectedTabMatch) {
			const tabName = selectedTabMatch[1];
			const tabButton = tabContainer.querySelector(`#nav-${tabName}-tab`);

			if (tabButton) {
				Tab.getOrCreateInstance(tabButton).show();
			}
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

export default initializePluginListPage;
