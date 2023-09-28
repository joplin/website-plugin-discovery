import cachedFetch from './cachedFetch';

const fetchFromGitHub = (resourcePath: string) => {
	const mirrors = [
		'https://raw.githubusercontent.com/',

		// Uncomment if developing in a region that can't use the default GitHub mirror
//		'https://raw.staticdn.net/',
//		'https://raw.fastgit.org/',
	];

	return cachedFetch(mirrors, resourcePath);
};

export default fetchFromGitHub;
