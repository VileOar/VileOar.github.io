/**
 * setup function
 */
(function() {
  fetch(PROJECT_PATH)
  .then((response) => response.json())
  .then((json) => buildPortfolio(json));
})();

function buildPortfolio(projectsData) {
  let allProjects = Object.keys(projectsData);

  // filter to only those defined in projectOrdering in common.js and sort accordingly
  allProjects = allProjects
      .filter((prjId) => projectOrdering.includes(prjId))
      .sort((prjId1, prjId2) => projectOrdering.indexOf(prjId1) - projectOrdering.indexOf(prjId2));
  
  // for every project group
  
}