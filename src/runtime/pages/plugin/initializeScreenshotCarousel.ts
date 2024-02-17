const { Carousel } = window.bootstrap;

const initializeScreenshotCarousel = (screenshotsCard: HTMLElement) => {
	const rawScreenshotContainer = screenshotsCard.querySelector('#raw-screenshots')!;
	const images = rawScreenshotContainer.querySelectorAll('img');

	// No screenshots?
	if (images.length === 0) {
		screenshotsCard.remove();
		return;
	}

	const screenshotsCarousel = screenshotsCard.querySelector('#screenshots-carousel')!;
	const carouselItemContainer = document.createElement('div');
	carouselItemContainer.classList.add('carousel-inner');

	let isFirstSlide = true;
	for (const image of images) {
		image.remove();

		const slide = document.createElement('div');
		slide.classList.add('carousel-item', 'screenshot-carousel-item');
		if (isFirstSlide) {
			slide.classList.add('active');
		}

		slide.appendChild(image);
		carouselItemContainer.appendChild(slide);
		isFirstSlide = false;
	}

	screenshotsCarousel.appendChild(carouselItemContainer);
	rawScreenshotContainer.remove();

	if (images.length > 1) {
		new Carousel('#' + screenshotsCarousel.id);
	} else {
		screenshotsCarousel.classList.add('-single-item');
	}
};

export default initializeScreenshotCarousel;
