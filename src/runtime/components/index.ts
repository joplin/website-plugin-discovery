import initializeBreadcrumbs from './initializeBreadcrumbs';
import initializeTooltips from './initializeTooltips';
import postprocessRenderedMarkdown from './postprocessRenderedMarkdown';
import postprocessTimestamps from './postprocessTimestamps';
import initializeSearch from './search/initializeSearch';

window.addEventListener('DOMContentLoaded', async () => {
	void initializeSearch();
	void initializeBreadcrumbs();
	void postprocessTimestamps();
	void initializeTooltips();

	for (const element of document.querySelectorAll<HTMLElement>('div[data--is-rendered-markdown]')) {
		postprocessRenderedMarkdown(element);
	}
});
