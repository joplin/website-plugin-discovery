import type PluginDataManager from './PluginDataManager';

const initializeSearch = (
	pluginData: PluginDataManager,
	searchInput: HTMLInputElement,
	searchResultsContainer: HTMLElement
): void => {
	const updateResults = () => {
		const query = searchInput.value;

		const maxResults = 5;
		const results = pluginData.search(query, maxResults);

		const resultsListElement = document.createElement('ul');

		for (const result of results) {
			const resultElement = document.createElement('li');

			const resultLink = document.createElement('a');
			resultLink.href = pluginData.getLinkToPlugin(result);
			resultLink.innerText = result.name;

			resultElement.appendChild(resultLink);
			resultsListElement.appendChild(resultElement);
		}

		searchResultsContainer.replaceChildren(resultsListElement);
	};

	searchInput.oninput = updateResults;
	searchInput.onclick = updateResults;
};

export default initializeSearch;
