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

let codeBlockIdCounter = 0;
const addCopyCodeButtons = (readmeContainer: HTMLElement) => {
	const pres = readmeContainer.querySelectorAll('pre');

	for (const pre of pres) {
		const codeBlocks = pre.querySelectorAll('code');

		// Only support <pre>s with format <pre><code>...</code></pre>
		if (codeBlocks.length !== 1) {
			continue;
		}

		const copyButtonContainer = document.createElement('div');
		copyButtonContainer.classList.add('copy-button-container');

		const copyButton = document.createElement('button');
		copyButton.classList.add('btn', 'copy-button', 'fade-in-on-hover');

		const setButtonLabel = (label: string) => {
			// Some browsers/screen readers don't read the title attribute.
			// set both aria-label and title.
			copyButton.setAttribute('aria-label', label);
			copyButton.setAttribute('title', label);
		};

		// Updates the screen reader label, hover label, and icon.
		const setContentAndIcon = (iconName: string, contentDescription: string) => {
			const copyIcon = document.createElement('i');
			copyIcon.classList.add('fas', iconName);
			copyButton.replaceChildren(copyIcon);
			setButtonLabel(contentDescription);
		};

		const setContentToCopyIcon = () => setContentAndIcon('fa-copy', 'Copy code block');
		const setContentToCopiedIcon = () => setContentAndIcon('fa-check', 'Copied');

		setContentToCopyIcon();

		// Announce content changes to screen readers
		copyButton.setAttribute('aria-live', 'polite');

		const codeBlock = codeBlocks[0];
		codeBlock.id = `readme-code-block-${codeBlockIdCounter++}`;
		copyButton.setAttribute('aria-controls', codeBlock.id);

		copyButton.onclick = async () => {
			await navigator.clipboard.writeText(codeBlock.innerText);

			setContentToCopiedIcon();
			setTimeout(setContentToCopyIcon, 1000);
		};

		copyButtonContainer.appendChild(copyButton);
		pre.insertAdjacentElement('beforeend', copyButtonContainer);

		pre.classList.add('has-copy-button');
	}
};

const addHeaderLinks = (readmeContainer: HTMLElement) => {
	const headers = readmeContainer.querySelectorAll('h1, h2, h3, h4, h5, h6');

	for (const header of headers) {
		const linkButton = document.createElement('button');

		linkButton.innerHTML = '<i class="fas fa-link"></i>';
		linkButton.classList.add('btn', 'link-to-header-button', 'fade-in-on-hover');

		linkButton.title = 'Link to header';
		linkButton.setAttribute('aria-label', 'Jump to header');

		linkButton.onclick = () => {
			location.hash = header.id;
		};

		header.insertAdjacentElement('beforeend', linkButton);
	}
};

const postprocessRenderedMarkdown = (readmeContainer: HTMLElement) => {
	addIdsToHeaders(readmeContainer);
	addHeaderLinks(readmeContainer);
	wrapTablesInContainers(readmeContainer);
	addCopyCodeButtons(readmeContainer);
};

export default postprocessRenderedMarkdown;
