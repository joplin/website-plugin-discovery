import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";


const fetchFromGitHub = async (resourcePath: string) => {
	const cacheId = resourcePath.replace(/[^a-zA-Z0-9_]/g, '-');
	const cachePath = join(__dirname, 'responseCaches', cacheId);
	if (existsSync(cachePath)) {
		return await readFile(cachePath, 'utf-8');
	}

	const mirrors = [
		'https://raw.githubusercontent.com/',
		'https://raw.staticdn.net/',
		'https://raw.fastgit.org/',
	];
	let result: string|null = null;
	for (let index = 0; index < mirrors.length; index++) {
		try {
			const url = mirrors[index] + resourcePath;
			result = await (await fetch(url)).text();
			break;
		} catch (error) {
			continue;
		}
	}

	if (result === null) {
		throw new Error('Cannot find avalible Github mirror');
	} else {
		// Cache the result
		await mkdir(dirname(cachePath), { recursive: true });
		await writeFile(cachePath, result, 'utf-8');
	}

	return result;
};

export default fetchFromGitHub;
