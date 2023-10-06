// Extracts information from the page's URL.
const getURLData = (url: string) => {
	// Support both plugin=someid and id=someid forms -- older links
	// may use id=
	const pluginIdMatch = url.match(/\?(?:plugin|id)=([^,?#/]+)[^/]*$/);
	const fromTabMatch = url.match(/\?from-tab=([^,?#/]+)[^/]*$/);

	return {
		// All tab names use alphabetic characters -- replace other characters.
		fromTab: fromTabMatch ? fromTabMatch[1].replace(/\W/g, '-') : null,
		pluginId: pluginIdMatch ? pluginIdMatch[1] : null,
	};
};

export default getURLData;
