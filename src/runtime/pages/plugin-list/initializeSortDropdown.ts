enum SortMethod {
	Default = 'default',
	LastUpdated = 'last-updated',
	Alphabetical = 'alphabetic',
}

type SortMethodChangeCallback = (value: SortMethod) => void;

let idCounter = 0;
const createSortMethodSelect = (onChange: SortMethodChangeCallback) => {
	const container = document.createElement('div');

	const select = document.createElement('select');
	select.classList.add('form-select', 'sort-dropdown');
	select.id = `sort-method-select-${idCounter++}`;

	const labelText = 'Sort by';
	select.setAttribute('aria-label', labelText);
	select.setAttribute('title', labelText);

	const saveMethodToOptionLabel = {
		[SortMethod.Default]: 'Popularity',
		[SortMethod.LastUpdated]: 'Last Updated',
		[SortMethod.Alphabetical]: 'Alphabetical',
	};

	for (const saveMethod in saveMethodToOptionLabel) {
		const optionLabel = saveMethodToOptionLabel[saveMethod as SortMethod];

		const option = document.createElement('option');
		option.innerText = optionLabel;
		option.value = saveMethod;

		if (saveMethod === SortMethod.Default) {
			option.selected = true;
		}

		select.appendChild(option);
	}

	select.onchange = () => {
		onChange(select.value as SortMethod);
	};

	container.appendChild(select);

	return {
		container,
		setValue: (value: SortMethod) => {
			select.value = value;
		},
	};
};

const cardsSortedBy = (sortMethod: SortMethod, cards: readonly HTMLElement[]) => {
	// Default => no change to order
	if (sortMethod === SortMethod.Default) {
		return cards.slice();
	}

	const getSortField = (element: HTMLElement) => {
		if (sortMethod === SortMethod.Alphabetical) {
			return element.getAttribute('data-sort-title') ?? '';
		} else if (sortMethod === SortMethod.LastUpdated) {
			const dateString = element.getAttribute('data-sort-updated') ?? '';

			// Show N/A plugins first (N/A, in general, means recently updated).
			if (dateString === 'N/A') {
				return -Infinity;
			}

			const timestamp = Date.parse(dateString);

			if (isNaN(timestamp)) {
				// Show after all other plugins
				return Infinity;
			} else {
				// Negate to show most recent first
				return -timestamp;
			}
		} else {
			const exhaustivenessCheck: never = sortMethod;
			return exhaustivenessCheck;
		}
	};

	const sortedCards = cards.slice();
	sortedCards.sort((a, b) => {
		const aField = getSortField(a);
		const bField = getSortField(b);

		if (aField < bField) {
			return -1;
		} else if (aField === bField) {
			return 0;
		} else {
			return 1;
		}
	});

	return sortedCards;
};

const initializeSortDropdowns = () => {
	const sectionContainers = document.querySelectorAll('.plugin-section');

	const sortMethodChangeListeners: SortMethodChangeCallback[] = [];
	const setSortMethod = (newSortMethod: SortMethod) => {
		// Change sorting for all sections
		for (const listener of sortMethodChangeListeners) {
			listener(newSortMethod);
		}
	};

	for (const section of sectionContainers) {
		const sortMethodSelectContainer = section.querySelector(':scope > .heading.-with-sort-option');
		if (!sortMethodSelectContainer) {
			continue;
		}

		const sortMethodSelect = createSortMethodSelect(setSortMethod);
		sortMethodSelectContainer.appendChild(sortMethodSelect.container);

		const sectionContentContainer = section.querySelector<HTMLElement>(':scope > .content')!;
		const sectionCards = [
			...sectionContentContainer.querySelectorAll<HTMLElement>(':scope > .card'),
		];

		const updateSorting = (newMethod: SortMethod) => {
			sortMethodSelect.setValue(newMethod);

			// Clear content
			sectionContentContainer.replaceChildren();

			// Add content back, but in sorted order
			const sortedSectionCards = cardsSortedBy(newMethod, sectionCards);
			sectionContentContainer.replaceChildren(...sortedSectionCards);
		};
		sortMethodChangeListeners.push(updateSorting);
	}
};

export default initializeSortDropdowns;
