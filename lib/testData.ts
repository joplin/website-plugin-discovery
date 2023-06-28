import path from 'path';
import { JoplinPlugin, MarketplaceData } from './types';

// Simplified data usable in tests. (Changing this data may require changes in tests).

const testPlugin1: JoplinPlugin = {
	manifest_version: 1,
	id: 'io.github.personalizedrefrigerator.js-draw',
	app_min_version: '2.8',
	version: '1.11.0',
	name: 'Freehand Drawing',
	description: 'Create and edit drawings with js-draw.',
	author: 'Henry Heino',
	homepage_url: 'https://github.com/personalizedrefrigerator/joplin-draw',
	repository_url: 'https://github.com/personalizedrefrigerator/joplin-draw',
	keywords: ['drawing', 'freehand-drawing', 'freehand', 'handwriting'],
	categories: ['editor'],
	_publish_hash: 'sha256:31e07e2eac6cf532add9fa2b864eb658c9e6a999de95e190ae30dbe0216423f4',
	_publish_commit: 'main:45a5f67e8368b88fa77e0835b6da60d4e7950b8c',
	_npm_package_name: 'joplin-plugin-freehand-drawing',
	downloadCount: 20,
	timeModified: '2023-06-27T05:37:11Z',
};

const testPlugin2: JoplinPlugin = {
	manifest_version: 1,
	id: 'org.joplinapp.plugins.ToggleSidebars',
	app_min_version: '1.6',
	version: '1.0.3',
	name: 'Note list and sidebar toggle buttons',
	description: 'Adds buttons to toggle note list and sidebar',
	author: 'Laurent Cozic',
	homepage_url: 'https://github.com/laurent22/joplin/tree/dev/packages/plugins/ToggleSidebars',
	repository_url: 'https://github.com/laurent22/joplin/tree/dev/packages/plugins/ToggleSidebars',
	_publish_hash: 'sha256:0ff54037d73f160c02b6ebe7af2ee56a89ab8241707965eb60e8d1bb41c19489',
	_publish_commit: 'git_compare_url:90103d135188995b08bff3c2c44006eae32e038d',
	_npm_package_name: '@joplin/joplin-plugin-toggle-sidebars',
	_recommended: true,
	downloadCount: 4410,
	timeModified: '2021-06-01T08:31:07Z',
};

const testPlugin3: JoplinPlugin = {
	manifest_version: 12,
	id: 'com.example.thisdoesntexist',
	app_min_version: '3.14159',
	version: 'badversion',
	name: 'Fake Plugin',
	description: 'This plugin does not exist',
	author: 'No Author',
	_publish_hash: 'sha256:0ff54037d73f160c02b6ebe7af2ee56a89ab8241707965eb60e8d1bb41c19489',
	_publish_commit: 'git_compare_url:90103d135188995b08bff3c2c44006eae32e038d',
	_npm_package_name: '@example/does-not-exist',
	_recommended: true,
	downloadCount: 1234,
	timeModified: '1900-06-01T08:31:07Z',
};

const testData: MarketplaceData = {
	allPossibleCategories: [
		{
			name: 'editor',
			displayName: 'Editor',
			plugins: [testPlugin1],
		},
	],
	plugins: {
		raw: {
			[testPlugin1.id]: testPlugin1,
			[testPlugin2.id]: testPlugin2,
			[testPlugin3.id]: testPlugin3,
		},
		all: [testPlugin1, testPlugin2, testPlugin3],
		recommended: [testPlugin2],
		trending: [testPlugin2],
	},
	config: {
		sourceDir: __dirname,
		distDir: path.join(__dirname, 'site'),
		site: '/site',
	},
};

export { testPlugin1, testPlugin2, testPlugin3 };
export default testData;
