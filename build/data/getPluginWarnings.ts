// Some plugins are unmaintained, have bugs, or misleading information in their
// READMEs.
// This file contains notes and warnings for these plugins that can be shown to
// users.

import { PluginWarning } from '../../lib/types';
import renderMarkdown from '../rendering/renderMarkdown';

const pluginWarnings: Record<string, PluginWarning[]> = {
	'joplin.plugin.app.locker': [
		{
			message: [
				'[End-to-end encryption](https://joplinapp.org/help/apps/sync/e2ee) is not local encryption.',
				'Enabling end-to-end encryption **does not** encrypt your data locally.',
			].join(' '),
			dateUpdated: '2023-12-09T04:19:38.641Z',
		},
	],
};

const getPluginWarnings = (pluginId: string): PluginWarning[] | undefined => {
	if (Array.isArray(pluginWarnings[pluginId])) {
		// Render each warning as markdown
		return pluginWarnings[pluginId].map(
			(warning): PluginWarning => ({
				dateUpdated: warning.dateUpdated,
				message: renderMarkdown(warning.message),
			}),
		);
	}

	return undefined;
};

export default getPluginWarnings;
