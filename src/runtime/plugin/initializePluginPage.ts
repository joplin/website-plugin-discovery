
import { Carousel } from 'bootstrap';

const initializeScreenshotCarousel = (screenshotsCard: HTMLElement) => {
	const rawScreenshotContainer = screenshotsCard.querySelector('#raw-screenshots')!;
	const images = rawScreenshotContainer.querySelectorAll('img');

	// No screenshots?
	if (images.length === 0) {
		screenshotsCard.remove();
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

	new Carousel('#' + screenshotsCarousel.id);
}

const initializePluginPage = () => {
	const screenshotsCards = document.querySelectorAll('#screenshots-container');
	for (const screenshotsCard of screenshotsCards) {
		initializeScreenshotCarousel(screenshotsCard as HTMLElement);
	}
};
export default initializePluginPage;
