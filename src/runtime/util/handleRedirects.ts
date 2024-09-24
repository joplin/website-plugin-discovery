const handleRedirects = () => {
	const pageUrl = new URL(location.href);
	if (pageUrl.host === 'joplin.github.io') {
		const path = pageUrl.pathname.replace(/^[/]?website-plugin-discovery[/]/, '');
		location.href = `https://joplinapp.org/plugins/${path}${pageUrl.search}${pageUrl.hash}`;
	}
};

export default handleRedirects;
