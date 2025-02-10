(function() {
    let prjId = "yellow_sky"

    fetch("/assets/data/projects.json")
        .then((response) => response.json())
        .then((json) => fillProjectData(json[prjId]));
})()

function fillProjectData(data) {
    // set name and description
    document.getElementById("prj_name").innerHTML = data["name"];
    document.getElementById("prj_desc").innerHTML = data["description"];

    // set metadata
    // TODO: get proper labels from a constants file
    let metaDetails = data["metadata"];
    let infoElem = document.getElementById("prj_info");
    if (metaDetails && infoElem) {
        for (let [key, value] of Object.entries(metaDetails)) {
            let keyStr = key;
            let valueStr = key=="link"?`<a href="#">${value}</a>`:value;
            let elemStr = `<li><strong class="item-title">${keyStr}:</strong> ${valueStr}</li>`;
            infoElem.innerHTML += elemStr;
        }
    }

    // set cover images
    // TODO...

    // set images
    // TODO...

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
                    col.innerHTML += `<li>${line}</li>`;
                }
            }
        }
    }

    // set the body content
    // TODO: if there is an html file in the asset folder with this id, render it here
}