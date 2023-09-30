interface Props {
	content: { html: string };
	onDismiss: () => void;
}

const makeAlert = (props: Props) => {
	const alertElement = document.createElement('div');
	const alertContent = document.createElement('div');
	const alertActions = document.createElement('div');
	const alertCloseButton = document.createElement('button');

	alertElement.classList.add('alert', 'alert-info', 'alert-dismissible');
	alertElement.setAttribute('aria-role', 'alert');

	alertCloseButton.classList.add('btn-close');
	alertCloseButton.setAttribute('aria-label', 'Close');

	const dismissDialog = () => {
		alertElement.remove();
		props.onDismiss();
	};
	alertCloseButton.onclick = dismissDialog;

	alertContent.innerHTML = props.content.html;

	alertActions.classList.add('btn-group', 'mb-0');
	alertElement.replaceChildren(alertContent, alertCloseButton);

	let actionAdded = false;

	return {
		addAction: (label: string, action: () => void) => {
			const actionButton = document.createElement('button');
			actionButton.classList.add('btn', 'btn-outline-primary');
			actionButton.innerText = label;
			actionButton.onclick = action;

			alertActions.appendChild(actionButton);

			// The first action button? Add the container
			if (!actionAdded) {
				// Also add a divider
				alertElement.appendChild(document.createElement('hr'));
				alertElement.appendChild(alertActions);

				actionAdded = true;
			}
		},
		dismissDialog,
		element: alertElement,
	};
};

export default makeAlert;
