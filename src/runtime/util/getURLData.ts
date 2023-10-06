// Extracts information from the page's URL.
const getURLData = (url: string) => {
	const fromTabMatch = url.match(/\?from-tab=([^,?#/]+)[^/]*$/);
	const pluginIdMatch = url.match(/\?plugin=([^,?#/]+)[^/]*$/);

	return {
		// All tab names use alphabetic characters -- replace other characters.
		fromTab: fromTabMatch ? fromTabMatch[1].replace(/\W/g, '-') : null,
		pluginId: pluginIdMatch ? pluginIdMatch[1] : null,
	};
};

export default getURLData;
