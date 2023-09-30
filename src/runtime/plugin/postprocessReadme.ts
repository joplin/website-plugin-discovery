const postprocessReadme = (readmeContainer: HTMLElement) => {
	// Add IDs to headers so that they can be linked to
	const headers = readmeContainer.querySelectorAll('h1, h2, h3, h4, h5, h6');
	for (const header of headers) {
		if (header.textContent) {
			header.setAttribute('id', encodeURIComponent(header.textContent.toLocaleLowerCase()));
		}
	}
};

export default postprocessReadme;
