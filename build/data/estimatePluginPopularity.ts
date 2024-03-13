import { PluginVersionInfo } from '../../lib/types';

const estimatePluginPopularity = (versions: Record<string, PluginVersionInfo>) => {
	// We only have limited information about how many users download a plugin. As such,
	// we base popularity on the following:
	// 1. Number of downloads per version in the last month.
	//   - Averaging over a month allows us to better handle frequently-updating plugins.
	//   - In some cases, outliers are removed, to avoid penalizing the case where several
	//     versions of a plugin is released in a short time.
	// 2. If no release in the last month, the number of downloads in the last release,
	//    scaled such that this number decreases with time. This scaling is intende to account
	//    for users uninstalling the plugin over time (or reinstalling).
	const now = Date.now();
	const versionsList = Object.values(versions);
	const fourWeeks = 1000 * 60 * 60 * 24 * 7 * 4;
	const versionsInLastMonth = versionsList.filter(
		(v) => now - new Date(v.createdAt).getTime() <= fourWeeks,
	);

	if (versionsInLastMonth.length === 0 && versionsList.length > 0) {
		const lastVersion = versionsList[versionsList.length - 1];

		const timeSinceLatestVersion = now - new Date(lastVersion.createdAt).getTime();
		let timeAdjustment = fourWeeks / timeSinceLatestVersion;

		// Less likely to be relevant if no updates in the last year
		if (timeSinceLatestVersion > fourWeeks * 4) {
			timeAdjustment *= 0.75;
		}

		return lastVersion.downloadCount * timeAdjustment;
	} else {
		let downloadSum = 0;
		let totalVersionsIncluded = 0;
		let smallestValue = Infinity;
		for (const version of versionsInLastMonth) {
			downloadSum += version.downloadCount;
			smallestValue = Math.min(smallestValue, version.downloadCount);
			totalVersionsIncluded++;
		}

		// Remove outlier
		if (versionsInLastMonth.length >= 3) {
			return (downloadSum - smallestValue) / (totalVersionsIncluded - 1);
		}

		return downloadSum / totalVersionsIncluded;
	}
};

export default estimatePluginPopularity;
