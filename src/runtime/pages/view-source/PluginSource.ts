import tar from 'tar-stream';
import { Buffer } from 'buffer';
import { format } from 'prettier/standalone';

// eslint-disable-next-line
const PrettierPluginBabel = require('prettier/plugins/babel');

// eslint-disable-next-line
const PrettierPluginESTree = require('prettier/plugins/estree');

type TarRecordType = Record<string, string>;

export default class PluginSource {
	private constructor(private data: TarRecordType) {}

	public getFiles(): string[] {
		return Object.keys(this.data);
	}

	public async getFileContent(filePath: string) {
		const textData = this.data[filePath];

		if (filePath.endsWith('js')) {
			return await format(textData, {
				parser: 'babel',
				plugins: [PrettierPluginBabel, PrettierPluginESTree],
			});
		}

		return textData;
	}

	public static async fromURL(url: string) {
		const fetchResult = await fetch(url);

		if (!fetchResult.ok) {
			throw new Error('Fetch error: ' + fetchResult.statusText);
		}

		const reader = fetchResult.body?.getReader();

		if (!reader) {
			throw new Error('fetchResult.body is undefined');
		}

		const extract = tar.extract({ defaultEncoding: 'hex' });

		const parseDataPromise = new Promise<TarRecordType>((resolve) => {
			const entries: Record<string, string> = {};
			extract.on('entry', (header, stream, next) => {
				// Skip directories (file paths will give us)
				// this information.
				if (header.type === 'directory') {
					next();
					return;
				}

				const decoder = new TextDecoder();
				const data: string[] = [];
				stream.on('data', (newData) => {
					data.push(decoder.decode(newData));
				});

				stream.on('end', () => {
					entries[header.name] = data.join('');
					next();
				});
			});

			extract.on('finish', () => {
				resolve(entries);
			});
		});

		let nextChunk: ReadableStreamReadResult<Uint8Array>;
		while (!(nextChunk = await reader.read()).done) {
			extract.write(Buffer.from(nextChunk.value));
		}

		extract.end();

		return new PluginSource(await parseDataPromise);
	}
}
