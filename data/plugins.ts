async function fetchPluginData() {
	let plugins = []
	const mirrors = [
		'https://raw.githubusercontent.com/joplin/plugins/master/manifests.json',
		'https://raw.staticdn.net/joplin/plugins/master/manifests.json',
		'https://raw.fastgit.org/joplin/plugins/master/manifests.json',
	]
	for (let index = 0; index < mirrors.length; index++) {
		try {
			plugins = await (await fetch(mirrors[index])).json()
		} catch (error) {
			if (index === mirrors.length - 1) {
				throw new Error("Cannot find avalible Github mirror");
			}
			continue
		}
	}
	return Object.values(plugins)
}

module.exports = function () {
	const plugins = fetchPluginData()
	return plugins
}
