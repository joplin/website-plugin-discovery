import getPluginDataManager from '../../util/getPluginDataManager';
import initializeDownloadPage from './initializeDownloadPage';

window.addEventListener('DOMContentLoaded', async () => {
	initializeDownloadPage(await getPluginDataManager());
});
