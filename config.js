const config = {
	mode: 'dev',
	dev: {
		rootDir: './',
		distDir: './site',
		site: '/site',
	},
	demo: {
		rootDir: './',
		distDir: './site',
		site: '/website-plugin',
	},
	prod: {
		rootDir: './',
		distDir: './site',
		site: '/website-plugin-discovery',
	},
}
module.exports = config[config.mode]
