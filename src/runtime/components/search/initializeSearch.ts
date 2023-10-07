import getPluginDataManager from '../../util/getPluginDataManager';

const initializeSearch = async () => {
	const pluginData = await getPluginDataManager();

	const searchInput = document.querySelector<HTMLInputElement>('#search-input')!;
	const searchResultsContainer = document.querySelector<HTMLElement>('#search-results-container')!;
	const searchContainer = searchInput.parentElement!;

	const updateResults = () => {
		const query = searchInput.value;

		if (query === '') {
			searchResultsContainer.replaceChildren();
			return;
		}

		const defaultMaxResults = 5;
		const results = pluginData.search(query, defaultMaxResults);

		const resultsListElement = document.createElement('ul');

		for (const result of results) {
			const resultElement = document.createElement('li');

			const iconElem = document.createElement('span');
			// Add the plugin icon
			iconElem.classList.add('fa-regular', 'fa-window-maximize');
			iconElem.classList.add('icon');

			const resultLink = document.createElement('a');
			resultLink.href = pluginData.getLinkToPlugin(result);

			const titleElem = document.createElement('span');
			titleElem.classList.add('title');
			titleElem.innerText = result.name;

			resultLink.replaceChildren(iconElem, titleElem);
			resultElement.appendChild(resultLink);
			resultsListElement.appendChild(resultElement);
		}

		searchResultsContainer.replaceChildren(resultsListElement);
	};

	searchInput.oninput = updateResults;
	searchInput.onclick = updateResults;

	// Hide search results when defocused
	searchContainer.addEventListener('focusin', () => {
		searchResultsContainer.style.display = 'block';
	});

	let focusoutTimeout: ReturnType<typeof setTimeout> | null = null;
	searchContainer.addEventListener('focusout', () => {
		if (focusoutTimeout) clearTimeout(focusoutTimeout);

		focusoutTimeout = setTimeout(() => {
			// focusout can be fired either for the searchContainer itself or one of
			// its children. Ensure that focus actually left the container.
			if (!searchContainer.contains(document.activeElement)) {
				searchResultsContainer.style.display = 'none';
			}
		}, 250);
	});

	// Extract a search query from the URL and update the search input/results:
	const searchQueryMatch = /\?search=([^;#]+).*$/.exec(location.href);
	if (searchQueryMatch) {
		const searchFor = searchQueryMatch[1];
		searchInput.value = decodeURIComponent(searchFor);

		// Show the navbar if on a small screen
		const navbarContent = document.querySelector('#navbarSupportedContent');

		if (!navbarContent) {
			console.warn('Unable to find the content of the navbar!');
		} else {
			navbarContent.classList.add('show');
		}

		searchInput.focus();
		updateResults();
	}
};

export default initializeSearch;
