/**
 * setup function
 */
(function() {
  fetch(PROJECT_PATH)
    .then((response) => response.json())
    .then((json) => buildHighlights(json));
})();

function buildHighlights(projectsData) {
  let projectsElem = "";
  for (let prjId of highlightsOrder) {
    if (prjId in projectsData && projectsData[prjId]["_enabled"]) {
      projectsElem += buildSingleProject(projectsData[prjId]);
    }
  }

  let highlightsElem = document.getElementById("highlights_container");
  highlightsElem.innerHTML += projectsElem;
}

function buildSingleProject(pData) {
  let pTitle = pData["name"];
  let pDate = pData["metadata"]["date"];
  let pLink = pData["metadata"]["link"];

  let pSummary = buildProjectDetails(pData["brief"]);
  let pContributions = buildProjectDetails(pData["overview"]);

  return `
    <div class="row project-highlight position-relative">
      <div class="col-lg-4">
        ${buildThumbnail(pData, true)}
      </div>
      <div class="col-lg-8">
        <div class="highlight-details">
          <div class="highlight-header">
            <h3 class="thumbnail-title">${pTitle}&nbsp;<em>(${pDate})</em></h3>
            <a href="${pLink}" target="_blank">
              <svg class="icon">
                <use xlink:href="assets/icons/icons.svg#icon-external-link"></use>
              </svg>
            </a>
          </div>
          <div class="highlight-body row">
            <div class="col-lg-4">
              <p class="inner-title">Summary</p>
              <div class="flex-row details-list">
                ${pSummary}
              </div>
            </div>
            <div class="col-lg-8">
              <p class="inner-title">Contributions</p>
              <div class="flex-row details-list">
                ${pContributions}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function buildProjectDetails(detailsLst) {
  let ret = "";
  for (let detail of detailsLst) {
    ret += `<div class="col">${detail}</div>`
  }
  return ret
}