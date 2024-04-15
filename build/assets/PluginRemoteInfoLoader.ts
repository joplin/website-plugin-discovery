// Handles loading assets for a single plugin

import path from 'path';
import {
	BuildConfig,
	JoplinPlugin,
	LabeledImage,
	PluginAssetData,
	PluginIconSet,
	PromoTile,
} from '../../lib/types';
import cachedFetch from '../fetch/cachedFetch';
import fetchFromGitHub from '../fetch/fetchFromGitHub';
import renderMarkdown from '../rendering/renderMarkdown';
import getDefaultPromoTileUri from './getDefaultPromoTileUri';

class GitHubReference {
	private gitHubBaseUri: string;
	public constructor(
		public readonly organization: string,
		public readonly project: string,
		public readonly branch: string = 'HEAD',
	) {
		this.gitHubBaseUri = `${organization}/${project}/${branch}`;
	}

	public convertURIToGitHubURI(uri: string, baseDirectory: string) {
		uri = uri.startsWith('.') ? path.posix.join(baseDirectory, uri) : uri;

		// Avoid relative URLs that still aren't resolved
		if (uri.startsWith('..')) {
			return null;
		}

		// Avoid non-GitHub links
		if (uri.match(/^\w+:\/\//)) {
			return null;
		}

		return `https://raw.githubusercontent.com/${this.gitHubBaseUri}/${uri}`;
	}

	public convertManifsetURIToGitHubURI(uri: string) {
		return this.convertURIToGitHubURI(uri, '');
	}

	public async fetchFile(filePath: string) {
		const fetchResponseData = await fetchFromGitHub(`${this.gitHubBaseUri}/${filePath}`);

		if (fetchResponseData.status === 200) {
			return fetchResponseData;
		}

		console.log(
			'Error fetching file. Status: ',
			fetchResponseData.status,
			fetchResponseData.result,
		);

		// Some error fetching
		return null;
	}
}

interface NPMPackageVersionData {
	dist: {
		tarball: string;
		shasum: string;
		integrity: string;
		attestations?: {
			url: string;
			provenance: { predicateType: string };
		};
	};
	version: string;
}

interface NPMPackageMaintainerData {
	name: string;
	email: string;
}

interface NPMPackageMetadata {
	readme: string;
	homepage: string;
	versions: Record<string, NPMPackageVersionData>;
	time: Record<string, string>; // version -> time
	maintainers: NPMPackageMaintainerData[];
}

class NPMReference {
	private packageMetadata: NPMPackageMetadata | null | undefined = undefined;

	public constructor(public readonly packageName: string) {}

	public async getPackageMetadata(): Promise<NPMPackageMetadata | null> {
		if (this.packageMetadata !== undefined) {
			return this.packageMetadata;
		}

		const data = await cachedFetch(['https://registry.npmjs.org/'], this.packageName);

		// If unsuccessful, return null and warn
		if (data.status !== 200) {
			console.log('Error fetching package data', data.status, data.result);
			return null;
		}

		let packageData: NPMPackageMetadata | null = null;

		try {
			packageData = JSON.parse(data.result);
			this.packageMetadata = packageData;
		} catch (error) {
			console.error(`Failed to parse NPM package metadata for ${this.packageName}. Error:`, error);
		}

		return packageData;
	}
}

// Capture groups:
// 1. The username/organization
// 2. The project name
const githubURLRegex = /^https?:\/\/(?:www\.)?github.com\/([^/]+)\/([^/]+)/;

export default class PluginRemoteInfoLoader {
	private gitHubReference?: GitHubReference;
	private npmReference: NPMReference;

	public constructor(
		private manifest: JoplinPlugin,
		private buildConfig: BuildConfig,
	) {
		let githubRepositoryMatch = githubURLRegex.exec(manifest.repository_url ?? '');
		if (!githubRepositoryMatch) {
			githubRepositoryMatch = githubURLRegex.exec(manifest.homepage_url ?? '');
		}

		if (githubRepositoryMatch) {
			const organization = githubRepositoryMatch[1];
			const project = githubRepositoryMatch[2].replace(/\.git$/, '');

			this.gitHubReference = new GitHubReference(organization, project);
		}

		this.npmReference = new NPMReference(manifest._npm_package_name);
	}

	// For testing only.
	// @internal
	public getReadmeFetchUri() {
		if (this.gitHubReference) {
			return this.gitHubReference.convertURIToGitHubURI('README.md', '');
		}

		// No direct README URI for NPM packages.
		return null;
	}

	private async getReadme() {
		// First try from GitHub
		if (this.gitHubReference) {
			const readme = await this.gitHubReference.fetchFile('README.md');

			if (readme && readme.status === 200) {
				return readme.result;
			}
		}

		// Fall back to NPM
		const npmReadme = (await this.npmReference.getPackageMetadata())?.readme;
		return npmReadme ?? 'No README';
	}

	public async getRenderedReadme() {
		const mapRelativeLink = (link: string) => {
			return this.gitHubReference?.convertURIToGitHubURI(link, '') ?? '#';
		};
		const mapAbsoluteLink = (link: string, tagName: string) => {
			// Images with https://github.com/user/project/path/to/image.png srcs won't load
			// when not on GitHub.
			//
			// However, anchor links work fine.
			if (tagName !== 'img') {
				return link;
			}

			const gitHubBlobUriRegex =
				/^https:\/\/(?:www\.)?github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.*)$/;
			const gitHubMatch = gitHubBlobUriRegex.exec(link);
			if (!gitHubMatch) {
				return link;
			}

			// Convert to a raw.githubusercontent.com URI
			const organization = gitHubMatch[1];
			const project = gitHubMatch[2];
			const branch = gitHubMatch[3];
			const path = gitHubMatch[4];

			const targetProjectReference = new GitHubReference(organization, project, branch);
			return targetProjectReference.convertURIToGitHubURI(path, '') ?? link;
		};

		return renderMarkdown(await this.getReadme(), {
			mapRelativeLink,
			mapAbsoluteLink,
			mapAnchor: (linkUri) => linkUri,
		});
	}

	// Screenshots or promo tile
	private processImageUri(uri: string | undefined) {
		// We allow all https:// URLs for screenshots -- plugin authors can specify images with
		// arbitrary srcs in the main page (so can already include arbitrary screenshots).
		if (uri?.startsWith('https://')) {
			return uri;
		} else if (uri) {
			return this.gitHubReference?.convertManifsetURIToGitHubURI(uri);
		}

		return null;
	}

	private async getScreenshots(): Promise<LabeledImage[]> {
		if (!this.manifest.screenshots) {
			return [];
		}

		const screenshots = [];

		for (const screenshot of this.manifest.screenshots) {
			const screenshotURI = this.processImageUri(screenshot.src);
			if (!screenshotURI) {
				continue;
			}

			screenshots.push({
				src: screenshotURI,
				label: screenshot.label ?? 'Unlabeled screenshot',
			});
		}

		return screenshots;
	}

	private async getPromoTile(): Promise<PromoTile> {
		const defaultPromoTile = async (): Promise<PromoTile> => {
			// Invert default icons in dark mode
			const classNames = ['-auto-invert'];

			const iconUri = await this.getIcon();
			let uri = iconUri;
			if (!uri) {
				uri = await getDefaultPromoTileUri(this.buildConfig, this.getCategories());
				classNames.push('-fill-icon-area');
			} else {
				classNames.push('-shrink', '-dark-mode-shadow');
			}

			return {
				src: uri,
				// In most cases the promo tile is purely decorative (and thus a label is
				// distracting).
				label: '',
				extraClassNames: classNames.join(' '),
			};
		};
		if (!this.manifest.promo_tile) {
			return await defaultPromoTile();
		}

		const imageUri = this.processImageUri(this.manifest.promo_tile.src);
		if (!imageUri) {
			return await defaultPromoTile();
		}

		const extraClassNames = ['-fill-icon-area'];

		// If the icon name ends with .autoinvert.ext (for some extension .ext),
		// we auto-invert it in dark mode.
		if (imageUri.match(/\.autoinvert\.[a-zA-Z]{2,4}$/)) {
			extraClassNames.push('-auto-invert');
		}

		return {
			src: imageUri,
			label: `${this.manifest.promo_tile.label ?? ''}`,
			extraClassNames: extraClassNames.join(' '),
		};
	}

	private async getIcon() {
		if (!this.manifest.icons || !this.gitHubReference) {
			return null;
		}

		const targetIconSizes: (keyof PluginIconSet)[] = ['256', '128', '48', '32'];

		// Select the largest icon by default
		for (const iconSize of targetIconSizes) {
			const iconUri = this.manifest.icons[iconSize];
			if (iconUri) {
				const gitHubUri = this.gitHubReference.convertManifsetURIToGitHubURI(iconUri);

				if (gitHubUri) {
					return gitHubUri;
				}
			}
		}

		return null;
	}

	private getCategories(): string[] {
		let categories = this.manifest.categories ?? [];

		// Protect against incorrectly specified data
		if (!Array.isArray(categories)) {
			categories = [];
		} else {
			categories = categories.filter((category) => typeof category === 'string');
		}

		return categories;
	}

	public async loadAssets(): Promise<PluginAssetData> {
		const promoTile = await this.getPromoTile();

		const iconUri = await this.getIcon();

		return {
			readme: await this.getRenderedReadme(),
			screenshots: await this.getScreenshots(),
			promoTile,
			iconUri,
			iconAdditionalClassNames: !iconUri ? '-missing' : '-dark-mode-shadow',
		};
	}

	private estimatedPackageVersion_: string | null = null;
	private async estimateNpmPackageVersion() {
		if (this.estimatedPackageVersion_) return this.estimatedPackageVersion_;

		const packageMetadata = await this.npmReference.getPackageMetadata();
		if (!packageMetadata) return null;

		const modifiedAt = Date.parse(this.manifest.timeModified);
		let latestVersion: string | null = null;
		for (const [version, timestamp] of Object.entries(packageMetadata.time)) {
			const time = Date.parse(timestamp);
			if (!isFinite(time)) continue;
			if (time - modifiedAt > 0) break;

			latestVersion = version;
		}

		this.estimatedPackageVersion_ = latestVersion;
		return latestVersion;
	}

	public async loadMayHaveVerifiedProvenance(): Promise<boolean> {
		const packageMetadata = await this.npmReference.getPackageMetadata();
		if (!packageMetadata) return false;

		const latestVersion = await this.estimateNpmPackageVersion();
		if (!latestVersion || !packageMetadata?.versions || !packageMetadata?.versions[latestVersion]) {
			return false;
		}

		const latestVersionData = packageMetadata.versions[latestVersion];
		return !!latestVersionData.dist.attestations?.provenance?.predicateType;
	}

	public async loadMaintainers(): Promise<string[]> {
		const packageMetadata = await this.npmReference.getPackageMetadata();

		if (!packageMetadata || !Array.isArray(packageMetadata.maintainers)) {
			return [];
		}

		const maintainers: string[] = packageMetadata.maintainers
			.map((maintainer) => maintainer.name ?? '')
			.filter((maintainer) => maintainer !== '');

		return maintainers;
	}
}
