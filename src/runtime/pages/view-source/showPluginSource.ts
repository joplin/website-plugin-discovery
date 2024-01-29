import PluginSource from './PluginSource';

import { EditorState, Extension } from '@codemirror/state';
import { basicSetup, EditorView } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import codeMirrorTheme from './codeMirrorTheme';
import type { Tab as TabType } from 'bootstrap';

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
	let source: PluginSource;
	try {
		source = await PluginSource.fromURL(pluginDownloadURL);
	} catch (error) {
		const errorMessage = `Error: ${error}`;
		if (errorMessage.includes('tar header')) {
			loadingMessage.innerText = `${errorMessage}. Note: Re-loading the page might fix this.`;
		} else {
			loadingMessage.innerText = errorMessage;
		}

		loadingMessage.classList.add('alert', 'alert-warning');
		return;
	}

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

	let firstTab: TabType | null = null;

	// Customize the order of files in the sidebar
	const pluginFiles = [...source.getFiles()];
	pluginFiles.sort((a, b) => {
		if (a === b) {
			return 0;
		}

		// Show manifest.json before all other files
		const manifestFileName = 'manifest.json';
		if (a === manifestFileName) {
			return -1;
		}

		if (b === manifestFileName) {
			return 1;
		}

		// Otherwise sort alphabetically
		return a > b ? 1 : -1;
	});

	const filePathToTab = new Map<string, TabType>();

	for (const filePath of pluginFiles) {
		const navItem = document.createElement('li');
		navItem.classList.add('nav-item');

		const tabButton = document.createElement('button');
		tabButton.classList.add('nav-link');

		navItem.appendChild(tabButton);
		filesNav.appendChild(navItem);

		tabButton.innerText = filePath;

		const tab = new Tab(tabButton);
		firstTab ??= tab;
		filePathToTab.set(filePath, tab);

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

		tabButton.addEventListener('shown.bs.tab', async () => {
			showCurrentFile();

			prettyPrintCheckbox.onchange = () => {
				showCurrentFile();
			};
		});

		tabButton.onclick = async () => {
			location.hash = encodeURIComponent(filePath);
			tab.show();
		};
	}

	const onHashChange = () => {
		// .substring(1): Remove the leading '#'
		const queriedFileName = decodeURIComponent((location.hash ?? '').substring(1));
		if (queriedFileName && filePathToTab.has(queriedFileName)) {
			filePathToTab.get(queriedFileName)?.show();
		} else {
			firstTab?.show();
		}
	};
	onHashChange();
	window.addEventListener('hashchange', onHashChange);

	loadingMessage.remove();
};

export default showPluginSource;
