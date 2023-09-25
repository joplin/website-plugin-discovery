import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'path';

const cachedFetch = async (mirrors: string[], resourcePath: string) => {
	// Convert the request into a unique ID.
	const cacheIdHash = createHash('sha256');
	cacheIdHash.update(mirrors[0]);
	cacheIdHash.update(resourcePath);
	const cacheId = cacheIdHash.digest('hex');

	const cachePath = join(dirname(__dirname), 'responseCaches', cacheId);
	if (existsSync(cachePath)) {
		return await readFile(cachePath, 'utf-8');
	}

	let result: string | null = null;
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

export default cachedFetch;
