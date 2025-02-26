const groupFilters = {
  "games": {
    "Context": [
      "Student",
      "Personal",
      "Professional",
      "Game Jam",
    ],
    "Engine": [
      "Godot",
      "Unity",
      "Unreal",
      "PyGame",
    ],
    "Visuals": [
      "2D",
      "3D",
      "AR/VR",
    ],
  },
  "it": {}
}

const FILTER_PREFIX = 'filter-';

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
      .filter((prjId) => projectOrdering.includes(prjId) && projectsData[prjId]["_enabled"]) // also filter those that have been manually disabled
      .sort((prjId1, prjId2) => projectOrdering.indexOf(prjId1) - projectOrdering.indexOf(prjId2));
  
  // get element to place the isotopes
  let portfolioDisplay = document.getElementById("portfolio_sections");

  // for every project group
  for (let grp of Object.keys(projectGroups)) {
    let prjsInGroup = allProjects.filter((prjId) => projectsData[prjId]["_group"] === grp); // use only the projects that belong to the current group

    portfolioDisplay.innerHTML += buildIsotopeLayout(grp, prjsInGroup, projectsData);
  }

  initIsotopes();
  //initGlightbox();
}

function buildIsotopeLayout(grp, prjIds, data) {
  let usedFilters = []; // save here only the filters that were used by the projects of this group. to prevent showing filters not in use
  
  let projectElems = "";
  for (let prjId of prjIds) {
    projectElems += buildProjectElem(grp, prjId, data, usedFilters);
    
    // TODO: still in this loop, build and add to a list the hidden project div that is meant to be shown as glightbox
    // when implemented, uncomment initGlightbox() and add glightbox class to project thumbnail
  }
  // the element that contains all projects for this group
  let isotopeContainer = isEmptyString(projectElems)?"":`
    <div class="row gy-4 isotope-container" data-aos="fade-up" data-aos-delay="200">
      ${projectElems}
    </div>
  `;

  let finalLayout = `
    ${buildFilterList(grp, usedFilters)}
    ${isotopeContainer}
  `;
  // TODO: add section title div
  finalLayout = isEmptyString(finalLayout)?"":`
    <!-- Portfolio Section -->
    <section id="portfolio-${toCSS(projectGroups[grp]["title"])}" class="portfolio section">
      <!-- Section Title -->
      <div class="container section-title" data-aos="fade-up">
        <div class="section-subtitle">${projectGroups[grp]["subtitle"]}</div>
        <h2>${projectGroups[grp]["title"]}</h2>
      </div><!-- End Section Title -->

      <div class="container">
        <div class="isotope-layout" data-default-filter="*" data-layout="masonry" data-sort="original-order">
          ${finalLayout}
        </div>
      </div>
    </section><!-- /Portfolio Section -->
  `;

  return finalLayout;
}

function buildFilterList(grp, usedFilters) {
  let filterListStr = ""; // defaults to nothing if there were no used filters at all
  
  // go through every filter group to check if any were used
  // TODO: display the name of the filter group somehow
  for (let [_filterGroup, filterItems] of Object.entries(groupFilters[grp])) {
    let filterGroupStr = "";

    // add the default
    filterGroupStr += `
      <li class="default-filter filter-active" data-filter="">Any</li>
    `;

    // filter in that filter group
    for (let filterName of filterItems) {
      let simpleFilter = toCSS(filterName); // correctly format filter
      
      if (usedFilters.includes(simpleFilter)) { // only add it if it was used
        filterGroupStr += `
          <li data-filter=".${FILTER_PREFIX + simpleFilter}">${filterName}</li>
        `;
      }
    }

    if (!isEmptyString(filterGroupStr)) { // only complete the element if it at least one of its filters was used, otherwise don't even build this group
      filterGroupStr = `
        <ul class="portfolio-filters isotope-filters" data-aos="fade-up" data-aos-delay="100">
          ${filterGroupStr}
        </ul><!-- End Filter Group -->
      `;
    }

    // append to final filter list
    filterListStr += filterGroupStr;
  }

  return filterListStr;
}

function buildProjectElem(grp, prjId, data, usedFilters) {
  let filterList = data[prjId]["filters"].map((str => toCSS(str)));
  usedFilters.push(...filterList); // add used filters to the list

  let filterStr = "";
  for (let f of filterList) {
    filterStr += FILTER_PREFIX + f + " ";
  }

  // TODO: add attribute for date and name and alter isotope setup to allow sorting

  return `
    <div class="col-lg-4 col-md-6 portfolio-item isotope-item ${filterStr}">
      ${buildThumbnail(prjId, data, false)}
    </div><!-- End Portfolio Item -->
  `; // add classes "project-glightbox preview-link" to activate glightbox
}