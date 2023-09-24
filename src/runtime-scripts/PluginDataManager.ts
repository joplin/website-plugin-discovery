import { type JoplinPlugin, type MarketplaceData } from '../../lib/types';

class PluginDataManager {
	private constructor(private readonly data: MarketplaceData) {}

	private isRecommended(pluginId: string): boolean {
		for (const plugin of this.data.plugins.recommended) {
			if (plugin.id === pluginId) {
				return true;
			}
		}

		return false;
	}

	public pluginFromId(pluginId: string): JoplinPlugin | null {
		for (const plugin of this.data.plugins.all) {
			if (plugin.id === pluginId) {
				return plugin;
			}
		}

		return null;
	}

	public getLinkToPlugin(plugin: JoplinPlugin): string {
		return this.data.config.site + '/plugin/' + plugin.id;
	}

	public getWeeksSinceUpdated(plugin: JoplinPlugin): number {
		const nowTime = new Date().getTime();
		const modifiedTime = new Date(plugin.timeModified).getTime();
		const hoursSinceUpdated = (nowTime - modifiedTime) / 1000 / 60 / 60;
		const weeksSinceUpdated = hoursSinceUpdated / 24 / 7;

		return weeksSinceUpdated;
	}

	public search(query: string, maxResults: number): JoplinPlugin[] {
		query = query.toLowerCase();

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
			const matchesAuthor = hasMatch(plugin.author.toLowerCase());
			const matchesId = query === plugin.id;

			if (!matchesTitle && !matchesBody && !matchesId && !matchesAuthor) {
				return 0;
			}

			let score = 0;

			if (matchesTitle || matchesId) {
				score += 10;
			}

			if (plugin.name.toLowerCase() === query) {
				score += 5;
			}

			if (matchesAuthor) {
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

		const matches = this.data.plugins.all.filter((plugin) => matchQuality(plugin) > 0);

		matches.sort((a, b) => {
			// Should be negative if a comes before b
			return matchQuality(b) - matchQuality(a);
		});

		return matches.slice(0, Math.min(maxResults, matches.length));
	}

	// Loads plugin data from a URL that points to a JSON file.
	public static async fromURL(url: string) {
		const response = await fetch(url);
		const dataJSON = await response.json();

		return new PluginDataManager(dataJSON);
	}

	public static fromData(data: MarketplaceData) {
		return new PluginDataManager(data);
	}
}

export default PluginDataManager;
