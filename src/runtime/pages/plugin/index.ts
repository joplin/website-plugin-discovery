import handleRedirects from '../../util/handleRedirects';
import initializePluginPage from './initializePluginPage';

window.addEventListener('DOMContentLoaded', async () => {
	initializePluginPage();
});

handleRedirects();
