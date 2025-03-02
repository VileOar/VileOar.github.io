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
    "Format": [
      "2D",
      "3D",
      "AR/VR",
    ],
  },
  "it": {
    "Context": [
      "Student",
      "Personal",
      "Professional",
    ],
    "Tools": [
      "Flutter",
      "WebGL",
    ],
  },
};

// list of sorters to be displayed
const sorterLabels = {
  "original": 'Relevance',
  "date": 'Recent',
  "name": 'Name',
};
// the list of sorters to add as attributes of each isotope element
const addedSorters = ["date", "name"];

const FILTER_PREFIX = 'filter-';
const SORTER_PREFIX = 'sorter-';

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

  let getSortData = Object.fromEntries(
    Object.entries(sorterLabels)
      .map(([key]) => [key, `[${SORTER_PREFIX + key}]`])
  ); // TODO: pass to function below
  console.log(getSortData)
  initIsotopes(getSortData);
  //initGlightbox();
}

function buildIsotopeLayout(grp, prjIds, data) {
  let usedFilters = []; // save here only the filters that were used by the projects of this group. to prevent showing filters not in use
  
  let projectElems = "";
  for (let prjId of prjIds) {
    projectElems += buildProjectElem(data[prjId], usedFilters);
  }

  let finalLayout = "";

  if (isEmptyString(projectElems)) {
    return "";
  }
  // the element that contains all projects for this group
  let isotopeContainer = `
    <div class="row gy-4 isotope-container" data-aos="fade-up" data-aos-delay="200">
      ${projectElems}
    </div>
  `;

  finalLayout = `
    ${buildFilterSorter(grp, usedFilters)}
    ${isotopeContainer}
  `;

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

function buildFilterSorter(grp, usedFilters) {
  let elemStr = "";
  let filterList = buildFilterList(grp, usedFilters);

  let sorterList = Object.entries(sorterLabels).reduce((accumulator, [sorter, label], currentIndex) => {
    let classes = currentIndex == 0 ? "filter-active" : "";
    return accumulator + `<li class="${classes}" data-sorter="${sorter}">${label}</li>`;
  }, "");

  let sorter = `
    <ul class="portfolio-filters isotope-sorter" data-aos="fade-up" data-aos-delay="100">
      ${sorterList}
    </ul><!-- End Filter Group -->
  `;

  // TODO: change the filter label + filter list layout to flex container and make sure the label occupies less space
  // TODO: put the 'Sort By' inside a <p> and center it above the sorters
  // Style everything

  elemStr = `
    <div class="row">
      <div class="col-lg-7">
        ${filterList}
      </div>
      <div class="col-lg-5 align-content-center">
        <div class="sorter-list">
          <p class="inner-title">Sort By:</p>
          ${sorter}
        </div>
      </div>
    </div>
  `;

  return elemStr;
}

function buildFilterList(grp, usedFilters) {
  let filterListStr = ""; // defaults to nothing if there were no used filters at all
  
  // go through every filter group to check if any were used
  for (let [filterGroup, filterItems] of Object.entries(groupFilters[grp])) {
    let filterGroupStr = "";

    // add the default
    filterGroupStr += `
      <li class="default-filter filter-active" data-filter="">Any</li>
    `;

    let filterCount = 0;

    // filter in that filter group
    for (let filterName of filterItems) {
      let simpleFilter = toCSS(filterName); // correctly format filter
      
      if (usedFilters.includes(simpleFilter)) { // only add it if it was used
        filterCount += 1;
        filterGroupStr += `
          <li data-filter=".${FILTER_PREFIX + simpleFilter}">${filterName}</li>
        `;
      }
    }

    if (filterCount > 1) { // only complete the element if it at least two of its filters were used, otherwise don't even build this group
      filterGroupStr = `
        <div class="filter-list">
          <p class="inner-title">${filterGroup}</p>
          <div>
            <ul class="portfolio-filters isotope-filters" data-aos="fade-up" data-aos-delay="100">
              ${filterGroupStr}
            </ul><!-- End Filter Group -->
          </div>
        </div>
      `;
    }
    else {
      filterGroupStr = "";
    }

    // append to final filter list
    filterListStr += filterGroupStr;
  }

  return filterListStr;
}

function buildProjectElem(pData, usedFilters) {
  let filterList = pData["filters"].map((str => toCSS(str)));
  usedFilters.push(...filterList); // add used filters to the list

  let filterStr = "";
  filterStr = filterList.reduce((accumulator, currentValue) => {
    return accumulator + ` ${FILTER_PREFIX}${currentValue}`; 
  }, filterStr);
  
  let sorterStr = "";
  sorterStr = addedSorters.reduce((accumulator, sorter) => {
    return accumulator + ` ${SORTER_PREFIX + sorter}="${pData["sorters"][sorter]}"`
  }, sorterStr);

  return `
    <div class="col-lg-4 col-md-6 portfolio-item isotope-item ${filterStr}" ${sorterStr}>
      ${buildThumbnail(pData, false)}
    </div><!-- End Portfolio Item -->
  `; // add classes "project-glightbox preview-link" to activate glightbox
}