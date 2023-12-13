// Some plugins are unmaintained, have bugs, or misleading information in their
// READMEs.
// This file contains notes and warnings for these plugins that can be shown to
// users.

import { PluginWarning } from '../../lib/types';
import renderMarkdown from '../rendering/renderMarkdown';

const pluginWarnings: Record<string, PluginWarning[]> = {
	// Warnings can be added here. For example,
	// 'plugin.id.here': [{
	//		message: 'some message here',
	//		dateUpdated: '2023-12-09T04:19:38.641Z',
	// }],
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
