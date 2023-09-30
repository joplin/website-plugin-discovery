import imageCouldStoreExternalCookies from './imageCouldStoreExternalCookies';

describe('imageCouldStoreExternalCookies', () => {
	it('should allow images from raw.githubusercontent.com', () => {
		expect(
			imageCouldStoreExternalCookies(
				'https://raw.githubusercontent.com/personalizedrefrigerator/joplin-draw/HEAD/screenshots/editor-lightdark-fullscreen.png',
			),
		).toBe(false);
	});

	it('should disallow images from example.com', () => {
		expect(imageCouldStoreExternalCookies('http://www.example.com/test.png')).toBe(true);
		expect(imageCouldStoreExternalCookies('https://www.example.com/test.png')).toBe(true);
	});
});
