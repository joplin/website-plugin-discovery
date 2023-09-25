// Fetch plugin assets from GitHub, or, as a fallback, from NPM.
// Note that not all plugin assets are available on NPM at present,
// so GitHub is prefered.
//
// Modeled on the approach used by https://www.npmjs.com/package/get-package-readme?activeTab=code

import fetchFromGitHub from "../../../lib/fetchFromGitHub";
import { IdToManifestRecord, PluginAssetData } from "../../../lib/types";
import renderMarkdown from "./renderMarkdown";

const getAllPluginAssets = async (plugins: IdToManifestRecord) => {
	// Capture groups:
	// 1. The username/organization
	// 2. The project name
	const githubURLRegex = /^https?:\/\/(?:www\.)?github.com\/([^/]+)\/([^/]+)/;

	const fetchTasks: Array<Promise<void>> = [];
	const result: Record<string, PluginAssetData> = Object.create(null);

	for (const id in plugins) {
		const githubRepositoryMatch = githubURLRegex.exec(plugins[id].repository_url ?? '');

		result[id] = {};

		if (githubRepositoryMatch) {
			const organization = githubRepositoryMatch[1];
			const project = githubRepositoryMatch[2];

			fetchTasks.push((async () => {
				const defaultBranchNames = [ 'main', 'master', 'dev' ];

				// TODO: Use the GitHub API to store the default branch name
				// (or switch to NPM).
				for (const branchName of defaultBranchNames) {
					const gitHubReadme = await fetchFromGitHub(`${organization}/${project}/${branchName}/README.md`);
					if (!gitHubReadme.startsWith('404')) {
						result[id].readme = await renderMarkdown(gitHubReadme);

						break;
					}
				}
			})());
		} else {
			result[id] = {
				readme: await renderMarkdown('😕 README fetch from NPM not implemented 😕.'),
			};
		}
	}

	await Promise.all(fetchTasks);
	

	return result;
};
export default getAllPluginAssets;
