// Fetch plugin assets from GitHub, or, as a fallback, from NPM.
// Note that not all plugin assets are available on NPM at present,
// so GitHub is prefered.
//
// Modeled on the approach used by https://www.npmjs.com/package/get-package-readme?activeTab=code

import path from "path";
import fetchFromGitHub from "../../fetch/fetchFromGitHub";
import { IdToManifestRecord, PluginAssetData } from "../../../lib/types";
import renderMarkdown from "./renderMarkdown";
import cachedFetch from "../../fetch/cachedFetch";

const getAllPluginAssets = async (plugins: IdToManifestRecord) => {
	// Capture groups:
	// 1. The username/organization
	// 2. The project name
	const githubURLRegex = /^https?:\/\/(?:www\.)?github.com\/([^/]+)\/([^/]+)/;

	const fetchTasks: Array<Promise<void>> = [];
	const result: Record<string, PluginAssetData> = Object.create(null);

	for (const id in plugins) {
		const manifest = plugins[id];

		let githubRepositoryMatch = githubURLRegex.exec(manifest.repository_url ?? '');
		if (!githubRepositoryMatch) {
			githubRepositoryMatch = githubURLRegex.exec(manifest.homepage_url ?? '');
		}

		result[id] = {
			readme: 'ERROR',
			screenshots: [],
		};

		if (githubRepositoryMatch) {
			const organization = githubRepositoryMatch[1];
			const project = githubRepositoryMatch[2];

			fetchTasks.push((async () => {
				const defaultBranchNames = [ 'main', 'master', 'dev' ];

				// TODO: Use the GitHub API to store the default branch name
				// (or switch to NPM).
				let gitHubBaseURI: string|null = null;

				for (const branchName of defaultBranchNames) {
					gitHubBaseURI = `${organization}/${project}/${branchName}`;
					const gitHubReadme = await fetchFromGitHub(`${gitHubBaseURI}/README.md`);
					if (!gitHubReadme.startsWith('404')) {
						result[id].readme = await renderMarkdown(gitHubReadme);

						break;
					}
				}

				// Fetch screenshots. Screenshots should be paths relative to the manifest
				if (manifest.screenshots) {
					result[id].screenshots = [];
					
					// TODO: For now, we assume that manifest.json is in the src/ directory.
					//       **This assumption is invalid in many cases**.
					for (const screenshot of manifest.screenshots) {
						const screenshotURI =
							screenshot.src.startsWith('.') ? path.join('src', screenshot.src) : screenshot.src;

						// Avoid non-relative URLs
						if (screenshotURI.startsWith('.')) {
							continue;
						}

						// Avoid links
						if (screenshotURI.match(/^\w+:\/\//)) {
							continue;
						}

						result[id].screenshots.push({
							uri: `https://raw.githubusercontent.com/${gitHubBaseURI}/${screenshotURI}`,
							label: screenshot.label ?? 'Unlabeled screenshot',
						});
					}
				}
			})());
		} else {
			fetchTasks.push((async () => {
				const packageData = JSON.parse(
					await cachedFetch(['https://registry.npmjs.org/'], manifest._npm_package_name)
				);
				result[id].readme = await renderMarkdown(packageData.readme ?? 'No README');
			})());
		}
	}

	await Promise.all(fetchTasks);
	
	return result;
};
export default getAllPluginAssets;
