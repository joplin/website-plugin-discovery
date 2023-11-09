// Based on (MIT-licensed) code originally developed for js-draw:
// https://github.com/personalizedrefrigerator/js-draw/blob/main/packages/typedoc-extensions/src/browser/editor/addCodeMirrorEditor.ts

import { EditorView } from 'codemirror';
import { tags } from '@lezer/highlight';
import { Extension } from '@codemirror/state';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';

// See https://codemirror.net/examples/styling/
// and https://github.com/codemirror/theme-one-dark/blob/main/src/one-dark.ts
const codeMirrorStyle = EditorView.theme({
	'&': {
		color: 'var(--cm-primary-text-color)',
		backgroundColor: 'var(--cm-primary-background-color)',

		border: '1px solid var(--cm-border-color)',
		borderRadius: '0.8em',
		overflow: 'hidden',

		width: '100%',

		fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace',
		fontSize: '0.9em',
	},

	// Change the selection color. See https://codemirror.net/examples/styling/
	'.cm-content': {
		caretColor: 'var(--cm-caret-color)',
	},
	'&.cm-focused .cm-cursor': {
		borderLeftColor: 'var(--cm-caret-color)',
	},
	// Needs high specificity to override the default
	'& .cm-selectionLayer .cm-selectionBackground, &.cm-focused .cm-selectionLayer .cm-selectionBackground, ::selection':
		{
			background: 'var(--cm-selection-background)',
			backgroundColor: 'var(--cm-selection-background) !important',
		},
	'.cm-activeLine': {
		// Default color
		color: 'var(--cm-primary-text-color)',
		backgroundColor: 'transparent',
	},

	'.cm-gutters': {
		backgroundColor: 'var(--cm-secondary-background-color)',
		color: 'var(--cm-secondary-text-color)',
		border: 'none',
	},
	'.cm-activeLineGutter': {
		backgroundColor: 'var(--cm-secondary-background-color)',
		color: 'var(--cm-secondary-text-color)',
		fontWeight: 'bold',
	},

	'.cm-tooltip': {
		backgroundColor: 'var(--cm-secondary-background-color)',
		color: 'var(--cm-secondary-text-color)',
		boxShadow: '2px 0px 0px var(--cm-shadow-color)',
	},

	'.cm-matchingBracket': {
		display: 'inline-block',
		transform: 'scale(1.1)',
		fontWeight: 'bold',
	},
});

const codeMirrorHighlightStyle = HighlightStyle.define([
	{ tag: tags.keyword, color: 'var(--cm-keyword-color)' },
	{ tag: tags.comment, color: 'var(--cm-comment-color)', fontStyle: 'italic' },
	{ tag: tags.string, color: 'var(--cm-string-color)' },
	{ tag: tags.paren, color: 'var(--cm-paren-color)' },
	{ tag: tags.variableName, color: 'var(--cm-varname-color)' },
	{ tag: tags.number, color: 'var(--cm-number-color)', fontWeight: 'bold' },
	{ tag: tags.integer, color: 'var(--cm-number-color)' },
	{ tag: tags.float, color: 'var(--cm-number-color)' },
	{ tag: tags.tagName, color: 'var(--cm-keyword-color)' },
]);

const codeMirrorTheme: Extension[] = [
	codeMirrorStyle,
	syntaxHighlighting(codeMirrorHighlightStyle),
];

export default codeMirrorTheme;
