import initializeBreadcrumbs from './initializeBreadcrumbs';
import postprocessTimestamps from './postprocessTimestamps';
import initializeSearch from './search/initializeSearch';

window.addEventListener('DOMContentLoaded', async () => {
	void initializeSearch();
	void initializeBreadcrumbs();
	void postprocessTimestamps();
});
