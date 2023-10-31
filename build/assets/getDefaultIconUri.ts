import { join } from 'path';
import { BuildConfig } from '../../lib/types';
import { readdir } from 'fs/promises';

const getDefaultIconUri = async (buildConfig: BuildConfig, manifestCategories: string[]) => {
	const iconsFolderName = 'default-plugin-icons';
	const iconsFolderPath = join(buildConfig.sourceDir, 'assets', iconsFolderName);
	const iconFileNames = await readdir(iconsFolderPath);

	if (!iconFileNames) {
		throw new Error(
			`Unable to read the set of default plugin icons. buildConfig: ${JSON.stringify(buildConfig)}`,
		);
	}

	// Create the object with a null prototype. This prevents
	//  '__proto__' in fileNamesByCategory from returning true.
	const fileNamesByCategory: Record<string, string[]> = Object.create(null);

	for (const fileName of iconFileNames) {
		const match = fileName.match(/^category-([a-z-]+)(-\d+)?\.svg$/);
		if (!match) {
			throw new Error(
				`Category filename doesn't match pattern category-[[name]]-[[number]].svg: ${fileName}`,
			);
		}

		const categoryName = match[1];
		fileNamesByCategory[categoryName] ??= [];
		fileNamesByCategory[categoryName].push(fileName);
	}

	let primaryCategory = manifestCategories[0] ?? 'integrations';
	primaryCategory = primaryCategory.toLowerCase().replace(/[^a-z0-9]/g, '-');

	if (!(primaryCategory in fileNamesByCategory)) {
		console.warn(`Missing icon for category, ${primaryCategory}`);
	}

	const fileNameCandidates = fileNamesByCategory[primaryCategory];
	const iconFileName = fileNameCandidates[manifestCategories.length % fileNameCandidates.length];

	return join(buildConfig.site, iconsFolderName, iconFileName);
};
export default getDefaultIconUri;
