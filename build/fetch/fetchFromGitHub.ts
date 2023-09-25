import cachedFetch from './cachedFetch';

const fetchFromGitHub = (resourcePath: string) => {
	const mirrors = [
		'https://raw.githubusercontent.com/',
		'https://raw.staticdn.net/',
		'https://raw.fastgit.org/',
	];

	return cachedFetch(mirrors, resourcePath);
};

export default fetchFromGitHub;
