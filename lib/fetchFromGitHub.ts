

const fetchFromGitHub = async (resourcePath: string) => {
	const mirrors = [
		'https://raw.githubusercontent.com/',
		'https://raw.staticdn.net/',
		'https://raw.fastgit.org/',
	];
	for (let index = 0; index < mirrors.length; index++) {
		try {
			const url = mirrors[index] + resourcePath;
			console.log('fetch', url);
			return await (await fetch(url)).text();
		} catch (error) {
			continue;
		}
	}
	throw new Error('Cannot find avalible Github mirror');
};

export default fetchFromGitHub;
