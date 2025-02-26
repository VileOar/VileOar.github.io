/**
 * setup function
 */
(function() {
    const fallback = "yellow_sky"; // fallback to yellow sky
    
    let params = new URLSearchParams(document.location.search);
    let prjId = params.get("prj");

    fetch(PROJECT_PATH)
        .then((response) => response.json())
        .then((json) => {
            prjId = (prjId in json)?prjId:fallback;
            fillProjectData(json[prjId]);
        });
})();

/**
 * automatically fills the page elments wih relevant project data taken from file
 * @param {Object} data json data for the specific project
 */
function fillProjectData(data) {
    prjId = data["_id"]

    // set name and description
    document.getElementById("prj_name").innerHTML = data["name"];
    document.getElementById("prj_desc").innerHTML = data["description"];

    // set link
    document.getElementById("prj_link").innerHTML = buildLinkButton(data["link"], "Link")

    // set metadata
    let metadata = [];
    for (let metaType of Object.values(data["metadata"])) {
        metadata = metadata.concat(metaType);
    }
    let infoElem = document.getElementById("prj_info");
    if (metadata && infoElem) {
        for (let metaEntry of metadata) {
            let keyStr = metaEntry[0];
            let valueStr = keyStr.toLowerCase()=="link"?`<a href="${metaEntry[1]}" target="_blank">${metaEntry[1]}</a>`:metaEntry[1];
            let elemStr = `<li><strong class="item-title">${keyStr}:</strong> ${valueStr}</li>`;
            infoElem.innerHTML += elemStr;
        }
    }

    // set cover image
    let coverStr = parseMediaId(data["media"]["cover"], prjId);
    document.getElementById("prj_cover").innerHTML = buildMediaElement(coverStr);

    // set images
    let imgData = data["media"]["gallery"];
    let galleryElem = document.getElementById("prj_imgs");
    if (imgData && galleryElem) {
        for (let media of imgData) {
            galleryElem.innerHTML += buildGalleryItem(parseMediaId(media, prjId));
        }
    }

    initGlightbox();

    // set roles and responsibilities
    let roles = data["roles"];
    let rolesColElems = [
        document.getElementById("prj_roles_col1"),
        document.getElementById("prj_roles_col2")
    ]
    let roleColIx = 0;
    // alternate between the existing columns
    if (roles) {
        for (let roleSet of roles) {
            let col = rolesColElems[roleColIx];
            roleColIx = (++roleColIx) % rolesColElems.length

            let first = true;
            for (let line of roleSet) {
                if (first) {
                    col.innerHTML += `<p class="inner-title">${line}</p>`;
                    first = false;
                }
                else {
                    col.innerHTML += `<p class="role-item">${line}</p>`;
                }
            }
        }
    }

    // set the body content
    // TODO: if there is an html file in the asset folder with this id, render it here
}

/**
 * return an html element to place in the project gallery
 * @param {string} url path to image, link to video, etc.
 * @returns html element string
 */
function buildGalleryItem(url) {
    // TODO: add a description argument
    return `
        <div class="col-2">
            <div class ="d-flex justify-content-center">
            <a class="project-glightbox" href="${url}">
                ${buildMediaElement(url, true)}
            </a>
            </div>
        </div>
    `;
}