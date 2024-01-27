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

	public getNPMLink(plugin: JoplinPlugin) {
		return `https://www.npmjs.com/package/${plugin._npm_package_name}`;
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
			let newQuery = query;

			const getOption = (optionExp: string, valueExp: string) => {
				const regex = new RegExp(`^(.*\\s+|)${optionExp}[=:]\\s*(${valueExp})(.*)$`);
				const match = newQuery.match(regex);

				let result: string | null = null;
				if (match) {
					const beforeMatch = match[1];
					result = match[2];
					const afterMatch = match[3];

					newQuery = beforeMatch + afterMatch;
				}
				return result;
			};

			const getStringOption = (optionNameExp: string) => {
				let match = getOption(optionNameExp, '"[^"]+"|[^" \\t;,]+');

				// Remove quotes and unescape contents if necessary
				if (match && match.match(/^["].*["]$/)) {
					match = match
						.replace(/^"/g, '')
						.replace(/"$/g, '')
						.replace(/[&]quo;/g, '"');
				}

				return match;
			};

			const getNumberOption = (optionNameExp: string) => {
				const match = getOption(optionNameExp, '\\d+');

				if (match) {
					return parseInt(match);
				}

				return null;
			};

			// Allow overriding the maximum results option using
			//   max-results=numberHere
			// syntax.
			const maxResults = getNumberOption('max-results') ?? defaultMaxResults;

			const onlyShowFromAuthor = getStringOption('author');
			const onlyShowForMaintainers = getStringOption('maintainer')?.split(/\sOR\s/);

			return {
				onlyShowFromAuthor,
				onlyShowForMaintainers,
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

		// Returns null if no match
		const getMatchQuality = (text: string): null | { quality: number } => {
			text = text.toLowerCase();
			if (hasFullTextMatch(query, text)) {
				return { quality: 2 };
			}
			const wordMatch = wordMatchCount(query, text);
			if (wordMatch > 0) {
				return { quality: wordMatch / (query.split(/\s+/).length || 1) };
			}
			return null;
		};

		const matchQuality = (plugin: JoplinPlugin): number => {
			const titleMatch = getMatchQuality(plugin.name);
			const bodyMatch = getMatchQuality(plugin.description);
			const authorMatch = getMatchQuality(plugin.author);
			const matchesId = query === plugin.id;

			if (!titleMatch && !bodyMatch && !matchesId && !authorMatch) {
				return 0;
			}

			let score = 0;

			if (matchesId) {
				score += 10;
			}

			if (titleMatch) {
				score += titleMatch.quality * 10;
			}

			if (plugin.name.toLowerCase() === query) {
				score += 5;
			}

			if (authorMatch) {
				score++;

				if (plugin.author.toLowerCase() === query) {
					score += 20;
				}
			}

			if (bodyMatch) {
				score++;
			}

			if (this.isRecommended(plugin.id)) {
				score *= 2;
			}

			// Updated in the last 12 weeks?
			const weeksSinceUpdated = this.getWeeksSinceUpdated(plugin);
			const updatedRecently = weeksSinceUpdated <= 12;
			if (updatedRecently) {
				score *= 1.15;
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
			.filter((plugin) => {
				if (!options.onlyShowForMaintainers) return true;

				for (const allowedMaintainer of options.onlyShowForMaintainers) {
					if (plugin._npm_package_maintainers.includes(allowedMaintainer)) {
						return true;
					}
				}

				return false;
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
