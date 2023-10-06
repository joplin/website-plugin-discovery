import PluginSource from './PluginSource';

import { EditorState, Extension } from '@codemirror/state';
import { basicSetup, EditorView } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import codeMirrorTheme from './codeMirrorTheme';

const fileExtensionToCMExtension: Record<string, Extension> = {
	css: css(),
	js: javascript(),
	ts: javascript({ typescript: true }),
	json: javascript(),
	html: html(),
	svg: html(),
};

const { Tab } = window.bootstrap;

const showPluginSource = async (outputContainer: HTMLElement, pluginDownloadURL: string) => {
	const filesNav = outputContainer.querySelector<HTMLElement>('#files-nav')!;
	const sourceViewContainer = outputContainer.querySelector<HTMLElement>('#source-view')!;
	const loadingMessage = outputContainer.querySelector<HTMLElement>('#loading-message')!;
	const prettyPrintCheckbox =
		outputContainer.querySelector<HTMLInputElement>('#pretty-print-checkbox')!;

	// Load and show data
	const source = await PluginSource.fromURL(pluginDownloadURL);

	// We use a read-only CodeMirror editor to display the data
	const codeMirrorExtensions = [
		basicSetup,
		codeMirrorTheme,
		EditorView.lineWrapping,
		EditorState.readOnly.of(true),
	];

	const sourceView = new EditorView({
		parent: sourceViewContainer,
		extensions: codeMirrorExtensions,
	});

	for (const filePath of source.getFiles()) {
		const navItem = document.createElement('li');
		navItem.classList.add('nav-item');

		const fileLink = document.createElement('a');
		fileLink.classList.add('nav-link');

		navItem.appendChild(fileLink);
		filesNav.appendChild(navItem);

		fileLink.href = '#';
		fileLink.innerText = filePath;

		const tab = new Tab(fileLink);

		const showCurrentFile = async () => {
			const fileExtensionMatch = filePath.match(/\.(\w+)$/);
			const fileExtension = fileExtensionMatch ? fileExtensionMatch[1] : '';

			const languageExtension = [];
			if (fileExtension in fileExtensionToCMExtension) {
				languageExtension.push(fileExtensionToCMExtension[fileExtension]);
			}

			// Replace the content and extensions to display the new document
			sourceView.setState(
				EditorState.create({
					doc: await source.getFileContent(filePath, prettyPrintCheckbox.checked),
					extensions: [codeMirrorExtensions, languageExtension],
				}),
			);
		};

		fileLink.addEventListener('shown.bs.tab', async () => {
			showCurrentFile();

			prettyPrintCheckbox.onchange = () => {
				showCurrentFile();
			};
		});

		fileLink.onclick = async () => {
			tab.show();
		};
	}

	loadingMessage.remove();
};

export default showPluginSource;
