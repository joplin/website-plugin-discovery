export interface LinkRewriter {
	mapRelativeLink: (linkUri: string, elementTagName: string) => string;
	mapAbsoluteLink: (linkUri: string, elementTagName: string) => string;
	mapAnchor: (linkUri: string, elementTagName: string) => string;
}
