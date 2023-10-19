const { Tab } = window.bootstrap;

const homepageTabName = 'home';

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

			breadcrumbCurrentTab.textContent = tabTrigger.textContent;

			const breadcrumbRootTab = document.querySelector('#home-tab-breadcrumb')!;

			// Hide the breadcrumb if on the home page
			if (currentTabHash === `#tab-${homepageTabName}`) {
				breadcrumbCurrentTab.style.display = 'none';
				breadcrumbRootTab.classList.add('active');
			} else {
				breadcrumbCurrentTab.style.display = '';
				breadcrumbRootTab.classList.remove('active');
			}
		});
	}

	const navigateToTabFromHash = (url: string) => {
		const selectedTabMatch = url.match(/#tab-([a-zA-Z0-9\-_%]+)$/);
		let tabName = selectedTabMatch ? selectedTabMatch[1] : homepageTabName;

		// Replace `%20`s (spaces) with dashes -- it simplifies other logic if
		// tab names can have spaces in links.
		tabName = tabName.replace(/%20/g, '-');

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
