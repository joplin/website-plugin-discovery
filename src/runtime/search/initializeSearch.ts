import type PluginDataManager from '../PluginDataManager';

const initializeSearch = (
	pluginData: PluginDataManager,
	searchInput: HTMLInputElement,
	searchResultsContainer: HTMLElement
): void => {
	const updateResults = () => {
		const query = searchInput.value;

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

	// Extract a search query from the URL and update the search input/results:
	const searchQueryMatch = /\?search=([^;#]+).*$/.exec(location.href);
	if (searchQueryMatch) {
		const searchFor = searchQueryMatch[1];
		searchInput.value = decodeURIComponent(searchFor);
		searchInput.focus();
		updateResults();
	}
};

export default initializeSearch;
