import { join } from 'path';
import { devConfig } from '../config';
import getDefaultIconUri from './getDefaultIconUri';

describe('getDefaultIconUri', () => {
	const iconsAssetDir = join(devConfig.site, 'default-plugin-icons');

	test('should default to the integrations icon when there is no category specified', async () => {
		expect(await getDefaultIconUri(devConfig, [])).toBe(
			join(iconsAssetDir, 'category-integrations.svg'),
		);
	});

	test("should return an icon for the first category in a plugin's categories", async () => {
		expect(await getDefaultIconUri(devConfig, ['files'])).toBe(
			join(iconsAssetDir, 'category-files.svg'),
		);
		expect(await getDefaultIconUri(devConfig, ['editor', 'files'])).toBe(
			join(iconsAssetDir, 'category-editor.svg'),
		);
		expect(await getDefaultIconUri(devConfig, ['editor', 'files', 'appearance'])).toBe(
			join(iconsAssetDir, 'category-editor.svg'),
		);
	});
});
