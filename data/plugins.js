async function fetchPluginData() {
  plugins =  await fetch('https://raw.githubusercontent.com/joplin/plugins/master/manifests.json').then(res => res.json());
  // plugins =  await fetch('https://raw.staticdn.net/joplin/plugins/master/manifests.json').then(res => res.json());

  return Object.values(plugins);
}

module.exports = function() {
  const plugins = fetchPluginData((res) => {return res});
  return plugins;
};