const handleRedirects = () => {
	const pageUrl = new URL(location.href);

	// The plugin website was previously hosted at joplin.github.io -- redirect old links
	// to it's new location:
	if (pageUrl.host === 'joplin.github.io') {
		const path = pageUrl.pathname.replace(/^[/]?website-plugin-discovery[/]/, '');
		location.href = `https://joplinapp.org/plugins/${path}${pageUrl.search}${pageUrl.hash}`;
	}
};

export default handleRedirects;
