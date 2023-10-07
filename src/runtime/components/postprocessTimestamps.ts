const postprocessTimestamps = () => {
	const timestamps = document.querySelectorAll<HTMLElement>('.process--format-as-local-time');

	for (const timestamp of timestamps) {
		if (timestamp.innerText === 'N/A') continue;

		try {
			const date = new Date(timestamp.innerText);

			const options: Intl.DateTimeFormatOptions = {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			};

			// undefined: Use the user's default locale
			timestamp.innerText = date.toLocaleDateString(undefined, options);
		} catch (error) {
			console.warn(`Error: ${error}. Possibly invalid timestamp element: ${timestamp.outerHTML}`);
		}
	}
};

export default postprocessTimestamps;
