const highlights = [
  "batter_time",
  "yellow_sky",
  "entryway",
  "nqueens",
]

/**
 * setup function
 */
(function() {
  fetch(PROJECT_PATH)
  .then((response) => response.json())
  .then((json) => buildHighlights(json));
})();

function buildHighlights(projectsData) {


  let highlightsElem = document.getElementById("highlights_container");
}

function buildSingleProject(prjId, data) {
  let pTitle = data["name"];
  let pDate = "TODO:";
  let pLink = data["link"];
  let pThumbnail = parseMediaId(data[prjId]["media"]["thumbnail"], prjId);

  let pStatsList = buildProjectStats(data);
  let pSummary = buildProjectDetails(data["brief"]);
  let pContributions = buildProjectDetails(data["overview"]);

  // TODO: use buildThumbnail from common.js

  return `
    <div class="row project-highlight position-relative">
      <div class="col-lg-4">
        <a class="stretched-link" href="portfolio-details.html?prj=${prjId}">
          <div class="thumbnail-box">
            <img class="img-fluid" src="${pThumbnail}" alt="${pName}">
            <div class="thumbnail-info">
              <div class="thumbnail-stat">
                <div title="Team Size">foo</div>
                <p>4</p>
              </div>
              ${pStatsList}
            </div>
          </div>
        </a>
      </div>
      <div class="col-lg-8">
        <div class="highlight-details">
          <div class="highlight-header">
            <h3 class="thumbnail-title">${pTitle + ' (' + pDate + ')'}</h3>
            <a href="${pLink}">
              <svg class="icon">
                <use xlink:href="assets/icons/icons.svg#icon-external-link"></use>
              </svg>
            </a>
          </div>
          <div class="highlight-body row">
            <div class="col-lg-4">
              <p class="inner-title">Summary</p>
              <div class="flex-row details-list">
                <div class="col">Strategy survival game</div>
                <div class="col">Resource management</div>
                <div class="col">Procedural generation</div>
                <div class="col">Made in Godot</div>
                ${pSummary}
              </div>
            </div>
            <div class="col-lg-8">
              <p class="inner-title">Contributions</p>
              <div class="flex-row details-list">
                <div class="col">Project Manager</div>
                <div class="col">Game Designer</div>
                <div class="col">Systems Designer and Programmer (inventory, quests, weather, time, etc.)</div>
                <div class="col">Lead Programmer</div>
                <div class="col">UI/UX Designer</div>
                <div class="col">Procedural Generation of Game World</div>
                <div class="col">2D Artist</div>
                <div class="col">Provided help with other tasks when necessary</div>
                ${pContributions}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}