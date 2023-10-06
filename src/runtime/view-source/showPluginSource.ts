import PluginSource from './PluginSource';

const showPluginSource = async (outputContainer: HTMLElement, pluginDownloadURL: string) => {
	const filesPane = document.createElement('div');
	const sourcePane = document.createElement('div');

	filesPane.classList.add('files');
	sourcePane.classList.add('source');

	sourcePane.innerText = 'Loading...';

	outputContainer.replaceChildren(filesPane, sourcePane);

	// Load and show data
	const source = await PluginSource.fromURL(pluginDownloadURL);

	const sourceViewer = document.createElement('pre');
	sourcePane.replaceChildren(sourceViewer);

	for (const file of source.getFiles()) {
		const fileLink = document.createElement('button');
		fileLink.classList.add('btn', 'btn-primary');

		fileLink.innerText = file;

		fileLink.onclick = async () => {
			sourceViewer.innerText = await source.getFileContent(file);
		};

		filesPane.appendChild(fileLink);
	}
};

export default showPluginSource;
