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
		return {
			result: await readFile(cachePath, 'utf-8'),
			status: parseInt(await readFile(cachePath + '.status', 'utf-8')),
		};
	}

	let result: string | null = null;
	let resultStatus: number | null = null;
	for (let index = 0; index < mirrors.length; index++) {
		try {
			const url = mirrors[index] + resourcePath;
			const fetchResult = await fetch(url);
			resultStatus = fetchResult.status;
			result = await fetchResult.text();
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
		await writeFile(cachePath + '.status', `${resultStatus}`, 'utf-8');
		await writeFile(cachePath, result, 'utf-8');
	}

	return { result, status: resultStatus };
};

export default cachedFetch;
