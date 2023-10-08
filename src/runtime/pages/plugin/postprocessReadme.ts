const addIdsToHeaders = (readmeContainer: HTMLElement) => {
	// Add IDs to headers so that they can be linked to
	const headers = readmeContainer.querySelectorAll('h1, h2, h3, h4, h5, h6');
	for (const header of headers) {
		if (header.textContent) {
			// Convert the header into a valid ID:
			const id = encodeURIComponent(header.textContent.toLocaleLowerCase());
			header.setAttribute('id', id.replace(/%20/g, '-'));
		}
	}
};

const wrapTablesInContainers = (readmeContainer: HTMLElement) => {
	const tables = readmeContainer.querySelectorAll('table');

	// Wrap each table in a div. This allows us to scroll the tables when
	// too large (rather than overflowing the README container).
	for (const table of tables) {
		const wrapper = document.createElement('div');
		wrapper.classList.add('table-wrapper');

		table.replaceWith(wrapper);
		wrapper.appendChild(table);
	}
};

const postprocessReadme = (readmeContainer: HTMLElement) => {
	addIdsToHeaders(readmeContainer);

	wrapTablesInContainers(readmeContainer);
};

export default postprocessReadme;
