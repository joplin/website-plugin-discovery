import handleRedirects from '../../util/handleRedirects';
import initializePluginListPage from './initializePluginListPage';

window.addEventListener('DOMContentLoaded', async () => {
	initializePluginListPage();
});

handleRedirects();
