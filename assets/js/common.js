const projectOrdering = [
    "batter_time",
    "yellow_sky",
    "doubble_dilemma",
    "entryway",
    "bonzios",
    "test"
];

const projectGroups = {
    "games": {
        "title": "Game Projects",
        "subtitle": "Silly Games"
    },
    "it": {
        "title": "Computer Science/Engineering",
        "subtitle": "Other IT Stuffs"
    }
}

const metadataFormatting = {
    "link": {
        "label": "Link",
        "icon": "",
    },
    "context": {
        "label": "Context",
        "icon": "",
    },
    "date": {
        "label": "Date",
        "icon": "",
    },
    "duration": {
        "label": "Duration",
        "icon": "",
    },
    "team": {
        "label": "Team Size",
        "icon": "",
    },
    "engine": {
        "label": "Engine",
        "icon": "",
    },
    "tools": {
        "label": "Tools/Framework",
        "icon": "", // TODO: same as 'engine'
    },
    "format": {
        "label": "Format",
        "icon": "",
    },
}

const PROJECT_PATH = "/assets/data/projects.json";
const BASE_MEDIA_PATH = "/assets/img/projects/";
const VIDEO_PROXY_IMG = "/assets/img/video_thumbnail.png";

/**
 * build an html string from a link to image/video/...
 * @param {string} url path to image, link to video, etc.
 * @param {boolean} forceImage if true, returns an image even if media is a video
 * @returns an html element to be added to page
 */
function buildMediaElement(url, forceImage=false) {
    if (isValidURL(url)) { // is web content
        if (forceImage) {
            return `<img src="${VIDEO_PROXY_IMG}" class="img-fluid" alt="Image">`
        }
        return `<iframe src="${url}" frameborder="0" allowfullscreen></iframe>`;
    }
    return `<img src="${url}" class="img-fluid" alt="Image">`;
}

/**
 * return a button element with an external link with my formatting
 * @param {string} url external link
 * @param {string} display text on button
 * @returns html element string
 */
function buildLinkButton(url, display) {
    return `<a class="link-btn" href="${url}" target="_blank">${display}</a>`
}

/**
 * return an element of a project thumbnail
 * @param {Object} pData the dictionary data of the project to build
 * @param {boolean} widebox whether this is a wide thumbnail or a small one (if wide, do not add title and make link stretched)
 * @returns html element string
 */
function buildThumbnail(pData, widebox=false) {
    let thumbnailMetadata = [
        "team",
        "duration",
        "engine",
        "tools",
        "format"
    ];

    let nameStr = pData["name"];
    let thumbnailStr = parseMediaId(pData["media"]["thumbnail"], pData["_id"]);

    let classStr = widebox?`class="stretched-link"`:"";
    let titleStr = widebox?"":`<h3 class="thumbnail-title">${nameStr}</h3>`;

    let statListStr = "";
    for (key of thumbnailMetadata) {
        if (key in pData["metadata"]) {
            let [keyStr, valueStr] = formatDataKeyValue(key, pData["metadata"][key]);
            statListStr += `<div class="thumbnail-stat" title="${keyStr}">foo ${valueStr}</div>` // TODO: change to add an icon with a tooltip
        }
    }

    return `
        <a ${classStr} href="portfolio-details.html?prj=${pData["_id"]}" title="${nameStr}">
            <div class="thumbnail-box">
                <img src="${thumbnailStr}" class="img-fluid" alt="${nameStr}">
                <div class="thumbnail-overlay">
                    ${titleStr}
                    <div class="thumbnail-info">
                        ${statListStr}
                    </div>
                </div>
            </div>
        </a>
    `;
}

/**
 * check if the url resolves to a valid url
 * @param {string} url path to image, link to video, etc.
 * @returns whether valid url
 */
function isValidURL(url) {
    try {
        new URL(url);
        return true;
    }
    catch(error) {
        // is not a valid url
    }

    return false;
}

/**
 * parses a media path/url
 * @param {string} mediaId media identifier
 * @param {string} prjId id of project
 * @returns string parsed into an absolute path or link
 */
function parseMediaId(mediaId, prjId) {
    if (!isValidURL(mediaId)) {
        return `${BASE_MEDIA_PATH}${prjId}/${mediaId}`;
    }
    return mediaId;
}

/**
 * do any processing if necessary to both key and value and return them in a display-ready format
 * @param {String} key the key of the metadata entry
 * @param {*} value the value of the metadata entry
 * @returns array with both key and value formatted correctly
 */
function formatDataKeyValue(key, value) {
    switch (key) {
        case 'link':
            value = `<a href="${value}" target="_blank">${value}</a>`;
        break;
    }
    return [metadataFormatting[key]['label'], value];
}

/**
 * convert a string to a valid CSS class name
 * @param {String} string original string
 * @returns converted string
 */
function toCSS(string) {
    return string
        .replace(/[\s!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '-')
        .toLowerCase();
}

function isEmptyString(string) {
    return string.trim() === "";
}