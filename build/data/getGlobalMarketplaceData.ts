import { type BuildConfig, type MarketplaceData } from '../../lib/types';
import getAllPossibleCategories from './getAllPossibleCategories';
import getPlugins from './getPlugins';

// Get all data relevant to the generated marketplace.
// This is the data given to the Mustache templates.
const getMarketplaceData = async (config: BuildConfig): Promise<MarketplaceData> => {
	const plugins = await getPlugins(config);
	return {
		allPossibleCategories: await getAllPossibleCategories(plugins),
		plugins,
		config,
	};
};

export default getMarketplaceData;
