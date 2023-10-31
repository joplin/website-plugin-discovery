import { JoplinPlugin } from '../../lib/types';
import { allCategories } from './Categories';

const normalizeWord = (word: string) => {
	word = word.toLowerCase();
	word = word.replace(/s$/, '');
	word = word.replace(/ing$/, '');
	return word;
};

const toBagOfWords = (text: string) => {
	const words = text.split(/\W+/).map((word) => normalizeWord(word));

	// Remove duplicates
	words.sort();

	const deduplicatedWords = [];
	let previousWord = '';
	for (const word of words) {
		if (previousWord !== word) {
			deduplicatedWords.push(word);
		}
		previousWord = word;
	}
	return deduplicatedWords;
};

export default class CategoryGuesser {
	private wordToCategoryScore: Record<string, Record<string, number>> = Object.create(null);

	public constructor(allPlugins: JoplinPlugin[]) {
		const trackWord = (word: string, targetCategories: string[], score: number) => {
			if (word === 'a' || word === 'some' || word === 'for' || word === 'but') {
				return;
			}

			this.wordToCategoryScore[word] ??= Object.create(null);

			for (const category of targetCategories) {
				if (allCategories.includes(category)) {
					if (!isFinite(this.wordToCategoryScore[word][category])) {
						this.wordToCategoryScore[word][category] = 0;
					}

					this.wordToCategoryScore[word][category] += score;
				}
			}
		};

		for (const plugin of allPlugins) {
			if (!Array.isArray(plugin.categories) || plugin.categories.length === 0) {
				continue;
			}

			const keywords = toBagOfWords((plugin.keywords ?? []).join(' '));
			const titleWords = toBagOfWords(plugin.name ?? '');
			const descriptionWords = toBagOfWords(plugin.description ?? '');

			for (const word of keywords) {
				trackWord(word, plugin.categories, 4);
			}

			for (const word of titleWords) {
				trackWord(word, plugin.categories, 3);
			}

			for (const word of descriptionWords) {
				trackWord(word, plugin.categories, 1);
			}
		}
	}

	public guessCategory(plugin: JoplinPlugin) {
		const keywords = toBagOfWords((plugin.keywords ?? []).join(' '));
		const titleWords = toBagOfWords(plugin.name ?? '');

		for (const category of allCategories) {
			const normalizedCategory = normalizeWord(category);
			if (keywords.includes(normalizedCategory) || titleWords.includes(normalizedCategory)) {
				return category;
			}
		}

		const categoryScores = Object.create(null);

		const processWordList = (words: string[], importance: number) => {
			for (const word of words) {
				const scores = this.wordToCategoryScore[word];
				for (const category in scores) {
					if (scores[category]) {
						categoryScores[category] ??= 0;
						categoryScores[category] += scores[category] * importance;
					}
				}
			}
		};
		processWordList(keywords, 5);
		processWordList(titleWords, 2);

		let bestCategory: string = 'integrations';
		let maxScore = 0;

		for (const category in categoryScores) {
			if (categoryScores[category] > maxScore) {
				bestCategory = category;
				maxScore = categoryScores[category];
			}
		}

		return bestCategory;
	}
}
