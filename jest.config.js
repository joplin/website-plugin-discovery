module.exports = {
	preset: "ts-jest",
	testEnvironment: 'node',

	// Prefer importing from .ts files to importing from .js files
	moduleFileExtensions: [
		'ts',
		'js',
	],
	// The glob patterns Jest uses to detect test files
	testMatch: ['**/*.test.ts'],
}
