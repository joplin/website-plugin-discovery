export enum Categories {
	Appearance = 'appearance',
	DeveloperTools = 'developer tools',
	Productivity = 'productivity',
	Themes = 'themes',
	Integrations = 'integrations',
	Viewer = 'viewer',
	Search = 'search',
	Editor = 'editor',
	Files = 'files',
	Tags = 'tags',
	PersonalKnowledgeManagement = 'personal knowledge management',
}

export const allCategories = Object.values(Categories) as string[];

export default Categories;
