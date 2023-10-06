import { IdToManifestRecord, type JoplinPlugin, MarketplaceData } from '../../../lib/types';

class PluginDataManager {
	private allPlugins: JoplinPlugin[];
	private constructor(
		private readonly rawPlugins: IdToManifestRecord,
		private readonly siteRoot: string,
	) {
		this.allPlugins = Object.values(rawPlugins);
	}

	private isRecommended(pluginId: string): boolean {
		if (!(pluginId in this.rawPlugins)) {
			return false;
		}
		return this.rawPlugins[pluginId]._recommended ?? false;
	}

	public pluginFromId(pluginId: string): JoplinPlugin | null {
		if (pluginId in this.rawPlugins) {
			return this.rawPlugins[pluginId];
		}

		return null;
	}

	public getLinkToPlugin(plugin: JoplinPlugin): string {
		return this.siteRoot + '/plugin/' + plugin.id;
	}

	// A URL that permits CORS requests
	public getCorsDownloadLink(plugin: JoplinPlugin) {
		return `https://raw.githubusercontent.com/joplin/plugins/master/plugins/${plugin.id}/plugin.jpl`;
	}

	// A URL associated with a specific version of the plugin (from the releases page)
	public getReleaseDownloadLink(plugin: JoplinPlugin) {
		const id = plugin.id;
		const version = plugin.version ?? 0;
		return `https://github.com/joplin/plugins/releases/download/plugins/${id}@${version}.jpl`;
	}

	public getWeeksSinceUpdated(plugin: JoplinPlugin): number {
		const nowTime = new Date().getTime();
		const modifiedTime = new Date(plugin.timeModified).getTime();
		const hoursSinceUpdated = (nowTime - modifiedTime) / 1000 / 60 / 60;
		const weeksSinceUpdated = hoursSinceUpdated / 24 / 7;

		return weeksSinceUpdated;
	}

	public search(query: string, defaultMaxResults: number): JoplinPlugin[] {
		const optionsFromQuery = () => {
			let maxResults = defaultMaxResults;
			let newQuery = query;

			// Allow overriding the maximum results option using
			//   max-results=numberHere
			// syntax.
			const maxResultsOptionMatch = newQuery.match(/^(.*\s+)max-results[=:]\s*(\d+)(.*)$/);
			if (maxResultsOptionMatch) {
				const beforeMatch = maxResultsOptionMatch[1];
				maxResults = parseInt(maxResultsOptionMatch[2]);
				const afterMatch = maxResultsOptionMatch[3];

				newQuery = beforeMatch + afterMatch;
			}

			let onlyShowFromAuthor: string | null = null;
			const authorOptionMatch = newQuery.match(/^(.*\s+|)author[=:]"([^"]+)"(.*)$/);
			if (authorOptionMatch) {
				const beforeMatch = authorOptionMatch[1];
				onlyShowFromAuthor = authorOptionMatch[2].replace(/[&]quo;/g, '"');
				const afterMatch = authorOptionMatch[3];

				newQuery = beforeMatch + afterMatch;
			}

			return {
				onlyShowFromAuthor,
				maxResults,
				newQuery,
			};
		};

		const options = optionsFromQuery();
		const maxResults = options.maxResults;
		query = options.newQuery.toLowerCase().trim();

		// Returns true if all of query is in text.
		const hasFullTextMatch = (query: string, text: string) => {
			return text.includes(query);
		};

		// Returns the number of words in query that match text.
		const wordMatchCount = (query: string, text: string): number => {
			const words = query.split(/\s+/);

			let wordMatchCount = 0;
			for (const word of words) {
				wordMatchCount += hasFullTextMatch(word, text) ? 1 : 0;
			}

			return wordMatchCount;
		};

		const hasMatch = (text: string): boolean => {
			return hasFullTextMatch(query, text) || wordMatchCount(query, text) > 0;
		};

		const matchQuality = (plugin: JoplinPlugin): number => {
			const matchesTitle = hasMatch(plugin.name.toLowerCase());
			const matchesBody = hasMatch(plugin.description.toLowerCase());
			const hasAuthorMatch = hasMatch(plugin.author.toLowerCase());
			const matchesId = query === plugin.id;

			if (!matchesTitle && !matchesBody && !matchesId && !hasAuthorMatch) {
				return 0;
			}

			let score = 0;

			if (matchesTitle || matchesId) {
				score += 10;
			}

			if (plugin.name.toLowerCase() === query) {
				score += 5;
			}

			if (hasAuthorMatch) {
				score++;

				if (plugin.author.toLowerCase() === query) {
					score += 20;
				}
			}

			if (matchesBody) {
				score++;
			}

			if (this.isRecommended(plugin.id)) {
				score *= 2;
			}

			// Updated in the last 12 weeks?
			const weeksSinceUpdated = this.getWeeksSinceUpdated(plugin);
			const updatedRecently = weeksSinceUpdated <= 12;
			if (updatedRecently) {
				score *= 1.1;
			} else if (!isNaN(weeksSinceUpdated)) {
				// Otherwise, slightly adjust by how recently the plugin was updated.
				score += 1 / weeksSinceUpdated;
			}

			return score;
		};

		const matches = this.allPlugins
			.filter((plugin) => {
				return !options.onlyShowFromAuthor || plugin.author === options.onlyShowFromAuthor;
			})
			.filter((plugin) => matchQuality(plugin) > 0);

		matches.sort((a, b) => {
			// Should be negative if a comes before b
			return matchQuality(b) - matchQuality(a);
		});

		return matches.slice(0, Math.min(maxResults, matches.length));
	}

	// Loads plugin data from a URL that points to a JSON file.
	public static async fromURL(url: string, siteRoot: string) {
		const response = await fetch(url);
		const dataJSON = await response.json();

		return new PluginDataManager(dataJSON, siteRoot);
	}

	public static fromData(data: MarketplaceData) {
		return new PluginDataManager(data.plugins.raw, data.config.site);
	}
}

export default PluginDataManager;
