const { Tooltip } = window.bootstrap;

const initializeTooltips = () => {
	// See https://getbootstrap.com/docs/5.3/components/tooltips/#enable-tooltips
	const tooltipTriggers = document.querySelectorAll('[data-bs-toggle="tooltip"]');
	for (const trigger of tooltipTriggers) {
		new Tooltip(trigger);
	}
};

export default initializeTooltips;
