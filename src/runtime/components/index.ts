import initializeBreadcrumbs from './initializeBreadcrumbs';
import initializeSearch from './search/initializeSearch';

window.addEventListener('DOMContentLoaded', async () => {
	void initializeSearch();
	void initializeBreadcrumbs();
});
