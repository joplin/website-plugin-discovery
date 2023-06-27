export interface BuildConfig {
	rootDir: string;
	distDir: string;
	site: string;
}

export const devConfig: BuildConfig = {
	rootDir: './',
	distDir: './site',
	site: '/site',
};

export const productionConfig: BuildConfig = {
	rootDir: './',
	distDir: './site',
	site: '/website-plugin-discovery',
};
