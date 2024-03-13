import { PluginVersionInfo } from '../../lib/types';
import estimatePluginPopularity from './estimatePluginPopularity';

describe('estimatePluginPopularity', () => {
	beforeEach(() => {
		jest.useFakeTimers();
		jest.setSystemTime(new Date('2024-03-13T04:39:32.281Z'));
	});

	test('should decrease ranking for plugins not updated in the last year', () => {
		const recentlyUpdatedPlugin: Record<string, PluginVersionInfo> = {
			'1.0.0': {
				createdAt: '2024-01-13T04:39:32.281Z',
				downloadCount: 100,
			},
			'0.12.0': {
				createdAt: '2022-01-13T04:39:32.281Z',
				downloadCount: 100,
			},
		};
		const oldPlugin: Record<string, PluginVersionInfo> = {
			'1.0.0': {
				createdAt: '2021-01-13T04:39:32.281Z',
				downloadCount: 300,
			},
			'0.12.0': {
				createdAt: '2019-01-13T04:39:32.281Z',
				downloadCount: 100,
			},
		};
		expect(estimatePluginPopularity(recentlyUpdatedPlugin)).toBeGreaterThan(
			estimatePluginPopularity(oldPlugin),
		);
	});

	test('should rank plugins with the same number of monthly downloads equivalently', () => {
		const plugin1: Record<string, PluginVersionInfo> = {
			'1.0.0': {
				createdAt: '2024-03-12T04:39:32.281Z',
				downloadCount: 100,
			},
			'0.12.0': {
				createdAt: '2024-03-05T04:39:32.281Z',
				downloadCount: 100,
			},
		};
		const plugin2: Record<string, PluginVersionInfo> = {
			'1.0.1': {
				createdAt: '2024-03-12T04:39:32.281Z',
				downloadCount: 100,
			},
			'1.0.0': {
				createdAt: '2024-03-01T04:39:32.281Z',
				downloadCount: 100,
			},
			'0.12.0': {
				createdAt: '2024-02-20T04:39:32.281Z',
				downloadCount: 100,
			},
		};
		expect(estimatePluginPopularity(plugin1)).toBe(estimatePluginPopularity(plugin2));
	});

	test('should rank plugins with more average downloads per version in the last month higher', () => {
		const plugin1: Record<string, PluginVersionInfo> = {
			'1.0.0': {
				createdAt: '2024-03-12T04:39:32.281Z',
				downloadCount: 103,
			},
			'0.12.0': {
				createdAt: '2024-03-05T04:39:32.281Z',
				downloadCount: 100,
			},
		};
		const plugin2: Record<string, PluginVersionInfo> = {
			'1.0.1': {
				createdAt: '2024-03-12T04:39:32.281Z',
				downloadCount: 100,
			},
			'1.0.0': {
				createdAt: '2024-03-01T04:39:32.281Z',
				downloadCount: 100,
			},
			'0.12.0': {
				createdAt: '2024-02-20T04:39:32.281Z',
				downloadCount: 100,
			},
		};
		expect(estimatePluginPopularity(plugin1)).toBeGreaterThan(estimatePluginPopularity(plugin2));
	});
});
