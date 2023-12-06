import path, { dirname, join } from 'path';
import { type BuildConfig } from '../lib/types';

const rootDir = dirname(__dirname);
const siteDirectory = join(rootDir, 'site');
const sourceDir = join(dirname(__dirname), 'src');

export const devConfig: BuildConfig = {
	sourceDir,
	distDir: siteDirectory,
	site: '/site',
};

export const productionBaseConfig: BuildConfig = {
	sourceDir,
	distDir: siteDirectory,
	site: '/',
};

const testOutputDir = path.join(__dirname, 'test');
const testDistDir = path.join(testOutputDir, 'dist');
export const testConfig: BuildConfig = {
	...devConfig,
	distDir: testDistDir,
};
