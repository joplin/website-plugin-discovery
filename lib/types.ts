export interface BuildConfig {
	sourceDir: string;
	distDir: string;
	site: string;
}

export type IdToManifestRecord = Record<string, JoplinPlugin>;
export type IdToAssetsRecord = Record<string, PluginAssetData>;

export interface PluginVersionInfo {
	downloadCount: number;
	createdAt: string;
}

export type Stats = {
	[pluginId: string]: {
		[version: string]: PluginVersionInfo;
	};
};

export interface PluginIconSet {
	'16'?: string;
	'32'?: string;
	'48'?: string;
	'128'?: string;
	'256'?: string;
}

export interface PluginWarning {
	message: string;
	dateUpdated: string;
}

export interface LabeledImage {
	src: string;
	label?: string;
}

export interface JoplinPlugin {
	// Directly from the manifest
	manifest_version: number;
	id: string;
	app_min_version: string;
	version: string;
	name: string;
	description: string;
	author: string;
	homepage_url?: string;
	repository_url?: string;
	keywords?: string[];
	categories?: string[];
	_publish_hash: string;
	_publish_commit: string;
	_npm_package_name: string;
	_recommended?: boolean;
	screenshots?: LabeledImage[];
	icons?: PluginIconSet;
	promo_tile?: LabeledImage;
	downloadCount: number;
	timeModified: string;

	// Loaded separately
	_npm_package_maintainers: string[];
	popularity: number;
	domId?: string;
	warnings?: PluginWarning[];
	assets?: PluginAssetData;
}

export interface PromoTile extends LabeledImage {
	extraClassNames: string; // space-separated
}

// Larger assets
export interface PluginAssetData {
	// Full text content of the readme.
	// The text stored in the `readme` property must be sanitized.
	readme: string;
	screenshots: LabeledImage[];
	promoTile: PromoTile;
	iconUri: string | null;
	iconAdditionalClassNames: string;
}

// Data about all plugins
export interface GlobalPluginData {
	raw: IdToManifestRecord;
	all: JoplinPlugin[];
	trending: JoplinPlugin[];
	recommended: JoplinPlugin[];
}

export interface Category {
	name: string;
	displayName: string;
	plugins: JoplinPlugin[];
}

interface BuildInfo {
	copyright: string;
}

// Global data about plugins, categories, etc.
export interface MarketplaceData {
	allPossibleCategories: Category[];
	plugins: GlobalPluginData;
	config: BuildConfig;
	buildInfo: BuildInfo;
}
