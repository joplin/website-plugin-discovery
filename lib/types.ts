export interface BuildConfig {
	sourceDir: string;
	distDir: string;
	site: string;
}

export type Manifest = Record<string, JoplinPlugin>;

export type Stats = Record<string, any>;

export interface JoplinPlugin {
	manifest_version: number;
	id: string;
	app_min_version: string;
	version: string;
	name: string;
	description: string;
	author: string;
	homepage_url: string;
	repository_url: string;
	keywords: string[];
	categories: string[];
	_publish_hash: string;
	_publish_commit: string;
	_npm_package_name: string;
	_recommended: boolean;
	downloadCount: number;
	timeModified: string;
	domId?: string;
}

// Data about all plugins
export interface GlobalPluginData {
	raw: Manifest;
	all: JoplinPlugin[];
	trending: JoplinPlugin[];
	recommended: JoplinPlugin[];
}

export interface Category {
	name: string;
	displayName: string;
	plugins: JoplinPlugin[];
}

// Global data about plugins, categories, etc.
export interface MarketplaceData {
	allPossibleCategories: Category[];
	plugins: GlobalPluginData;
	config: BuildConfig;
}
