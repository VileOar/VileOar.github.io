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
    "Field": [
      "Computer Graphics",
      "Mobile Development",
    ]
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
const FILTERCTG_PREFIX = 'filterctg-';
const SORTERCTG_PREFIX = 'sorterctg-';

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
  );
  initIsotopes(getSortData);
  setupTagctgBtns();
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
  let usedCtgs = {}

  let elemStr = "";
  let filterList = buildFilterList(grp, usedFilters, usedCtgs);
  let sorterList = buildSorterList();

  let filterCtgStr = "";
  for (let [key, label] of Object.entries(usedCtgs)) {
    filterCtgStr += `
      <div class="tag-selector btn-hover" taglist-ctg="${FILTERCTG_PREFIX + key}">
        <p class="toggle-btn inner-title">${label}:</p>
        <p class="toggle-btn btn-active">Any</p>
      </div>
    `;
  }

  elemStr = `
    <div id="tags_btns" class="row">
      <div class="col-lg-7">
        <div class="tagctg-list">
          ${filterCtgStr}
        </div>
      </div>
      <div class="col-lg-5 align-content-center">
        <div class="tagctg-list">
          <div class="tag-selector btn-hover" taglist-ctg="${SORTERCTG_PREFIX}sorter">
            <p class="toggle-btn inner-title">Sort By:</p>
            <p class="toggle-btn btn-active">${sorterLabels["original"]}</p>
          </div>
        </div>
      </div>
    </div>
    <div>
      ${sorterList}
      ${filterList}
    </div>
  `;

  return elemStr;
}

function buildSorterList() {
  let sorterList = Object.entries(sorterLabels).reduce((accumulator, [sorter, label], currentIndex) => {
    let classes = currentIndex == 0 ? "btn-active" : "";
    return accumulator + `<li class="toggle-btn ${classes}" data-sorter="${sorter}">${label}</li>\n`;
  }, "");

  sorterList = `
    <ul taglist-ctg="${SORTERCTG_PREFIX}sorter" class="portfolio-taglist taglist-hide isotope-sorter" data-aos="fade-up" data-aos-delay="100">
      ${sorterList}
    </ul><!-- End Filter Group -->
  `;

  return sorterList;
}

function buildFilterList(grp, usedFilters, OUT_usedCtg) {
  
  let filterListStr = ""; // defaults to nothing if there were no used filters at all
  
  // go through every filter group to check if any were used
  for (let [filterCtg, filterItems] of Object.entries(groupFilters[grp])) {
    let formattedCtg = toCSS(filterCtg);

    let filterGroupStr = "";

    // add the default
    filterGroupStr += `
      <li class="toggle-btn default-filter btn-active" data-filter="">Any</li>
    `;

    let filterCount = 0;

    // filter in that filter group
    for (let filterName of filterItems) {
      let simpleFilter = toCSS(filterName); // correctly format filter
      
      if (usedFilters.includes(simpleFilter)) { // only add it if it was used
        filterCount += 1;
        filterGroupStr += `
          <li class="toggle-btn" data-filter=".${FILTER_PREFIX + simpleFilter}">${filterName}</li>
        `;
      }
    }

    if (filterCount > 1) { // only complete the element if it at least two of its filters were used, otherwise don't even build this group
      filterGroupStr = `
        <ul taglist-ctg="${FILTERCTG_PREFIX + formattedCtg}" class="portfolio-taglist taglist-hide isotope-filters" data-aos="fade-up" data-aos-delay="100">
          ${filterGroupStr}
        </ul><!-- End Filter Group -->
      `;

      Object.assign(OUT_usedCtg, {[formattedCtg]: filterCtg});
    }
    else {
      filterGroupStr = "";
    }

    // append to final filter list
    filterListStr += filterGroupStr;
  }

  return filterListStr;
}

function buildProjectElem(pData, OUT_usedFilters) {
  let filterList = pData["filters"].map((str => toCSS(str)));
  OUT_usedFilters.push(...filterList); // add used filters to the list

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
  ` // add classes "project-glightbox preview-link" to activate glightbox
}

// setup the behaviour of the tag categories buttons
function setupTagctgBtns() {


  // TODO: redo, not using ID (cuz then it only works for one isotope layout); instead, here, search for all layouts first use classes instead or attr

  // for each isotope
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    // select the tag buttons div and for each tag selector div
    isotopeItem.querySelector('#tags_btns').querySelectorAll('.tag-selector').forEach(function(tagSelector) {
      // add event listener
      tagSelector.addEventListener('click', function() {
        let showhide = !tagSelector.classList.contains('btn-active'); // whether this click is hiding or showing the taglist
  
        isotopeItem.querySelector('#tags_btns').querySelectorAll('.tag-selector').forEach(function(other) {
          other.classList.remove('btn-active');
        });
  
        // hide all taglists by default
        isotopeItem.querySelectorAll('.portfolio-taglist').forEach(function(taglist) {
          taglist.classList.add('taglist-hide');
        });
  
        if (showhide) {
          tagSelector.classList.add('btn-active');
          // if showing, then show the corresponding one
          let ctgKey = this.getAttribute('taglist-ctg');
          let clickedTaglist = isotopeItem.querySelector(`.portfolio-taglist[taglist-ctg="${ctgKey}"]`);
          clickedTaglist.classList.remove('taglist-hide');
        }
      });
    });
  });
}