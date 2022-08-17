async function fetchPluginData() {
	let plugins = [];
  const mirrors = [
    'https://raw.githubusercontent.com/joplin/plugins/master/manifests.json',
    'https://raw.staticdn.net/joplin/plugins/master/manifests.json',
    'https://raw.fastgit.org/joplin/plugins/master/manifests.json'
  ]
  for (let index = 0; index < mirrors.length; index++) {
    try {
      plugins =  await fetch(mirrors[index]).then(res => res.json());
    } catch (error) {
      continue;
    }
  }
	return Object.values(plugins);
}

module.exports = function () {
	const plugins = fetchPluginData();
	return plugins;
};
