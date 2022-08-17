module.exports = function() {
  const allPossibleCategoriesRaw = ['Appearance', 'Developer Tools', 'Productivity', 'Themes', 'Integrations', 'Viewer', 'Search', 'Tags', 'Editor', 'Files', 'Personal Knowledge Management'];
  const allPossibleCategories = allPossibleCategoriesRaw.map(category => {
    return {
      name: category.toLowerCase().replace(/[ ]/g, '-' ),
      displayName: category
    };
  })
  return allPossibleCategories;
};