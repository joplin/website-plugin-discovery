import initializeBreadcrumbs from './initializeBreadcrumbs';
import initializeTooltips from './initializeTooltips';
import postprocessTimestamps from './postprocessTimestamps';
import initializeSearch from './search/initializeSearch';

window.addEventListener('DOMContentLoaded', async () => {
	void initializeSearch();
	void initializeBreadcrumbs();
	void postprocessTimestamps();
	void initializeTooltips();
});
