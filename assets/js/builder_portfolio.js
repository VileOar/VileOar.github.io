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
  let portfolioDisplay = document.getElementById("custom_portfolio_display");

  // for every project group
  for (let [grp, _label] of Object.entries(projectGroups)) {
    let prjsInGroup = allProjects.filter((prjId) => projectsData[prjId]["_group"] === grp); // use only the projects that belong to the current group

    portfolioDisplay.innerHTML += buildIsotopeLayout(grp, prjsInGroup, projectsData);
  }

  initIsotopes();
  initGlightbox();
}

function buildIsotopeLayout(grp, prjIds, data) {
  let usedFilters = []; // save here only the filters that were used by the projects of this group. to prevent showing filters not in use
  
  let projectElems = "";
  for (let prjId of prjIds) {
    projectElems += buildProjectElem(grp, prjId, data, usedFilters);
    
    // TODO: still in this loop, build and add to a list the hidden project div that is meant to be shown as glightbox
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
  finalLayout = isEmptyString(finalLayout)?"":`
    <div class="isotope-layout" data-default-filter="*" data-layout="masonry" data-sort="original-order">
      ${finalLayout}
    </div>
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

  let nameStr = data[prjId]["name"];
  let thumbnailStr = parseMediaId(data[prjId]["media"]["thumbnail"], prjId);

  // TODO: add attribute for date and name and alter isotope setup to allow sorting

  return `
    <div class="col-lg-4 col-md-6 portfolio-item isotope-item ${filterStr}">
      <div class="portfolio-content h-100">
        <div class="portfolio-thumbnail">
          <img src="${thumbnailStr}" class="img-fluid" alt="${nameStr}">
          <div class="portfolio-info">
            <h4>${nameStr}</h4>
            <p>Description</p>
            <a href="${thumbnailStr}" title="${nameStr}" data-gallery="portfolio-${grp}" class="project-glightbox preview-link"><i class="bi bi-zoom-in"></i></a>
            <a href="portfolio-details.html?prj=${prjId}" title="More Details" class="details-link"><i class="bi bi-link-45deg"></i></a>
          </div>
        </div>
      </div>
    </div><!-- End Portfolio Item -->
  `;
}