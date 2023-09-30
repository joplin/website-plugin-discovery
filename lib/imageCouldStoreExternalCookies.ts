const imageCouldStoreExternalCookies = (imageSrc: string) => {
	// Domains that don't seem to store cookies (perhaps they could, though? See
	// https://github.com/privacy/cookies).
	const allowedImageDomains = ['raw.githubusercontent.com', 'user-images.githubusercontent.com'];
	for (const domain of allowedImageDomains) {
		if (imageSrc.startsWith(`http://${domain}`) || imageSrc.startsWith(`https://${domain}`)) {
			return false;
		}
	}

	return true;
};

export default imageCouldStoreExternalCookies;
