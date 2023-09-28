module.exports = {
	'**/*.{js,ts}': ['eslint --fix', 'prettier --ignore-path .eslintignore --write'],
	'**/*.{md,scss,css}': ['prettier --ignore-path .eslintignore --write'],
};
