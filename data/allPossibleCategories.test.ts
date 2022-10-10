import getAllPossibleCategories, { Category } from './allPossibleCategories'

jest.setTimeout(120000)

let allPossibleCategories: Category[] = []

beforeAll(async () => {
	allPossibleCategories = await getAllPossibleCategories()
	return allPossibleCategories
})

describe('allPossibleCategories data', () => {
	test('should not be empty', async () => {
		expect(allPossibleCategories.length).toBeGreaterThan(0)
	})
})
