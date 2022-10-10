const config = require('../config.js')

export interface Config {
	rootDir: string
	distDir: string
	site: string
}

export default async function (): Promise<Config> {
	return config
}
