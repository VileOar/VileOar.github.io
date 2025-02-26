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

function buildThumbnail(prjId, data, widebox=false) {
    let nameStr = data[prjId]["name"];
    let thumbnailStr = parseMediaId(data[prjId]["media"]["thumbnail"], prjId);

    let classStr = widebox?`class="stretched-link"`:"";
    let titleStr = widebox?"":`<h3 class="thumbnail-title">${nameStr}</h3>`;

    return `
        <a ${classStr} href="portfolio-details.html?prj=${prjId}" title="${nameStr}">
            <div class="thumbnail-box">
                <img src="${thumbnailStr}" class="img-fluid" alt="${nameStr}">
                <div class="thumbnail-overlay">
                    ${titleStr}
                    <div class="thumbnail-info">
                        <div class="thumbnail-stat" title="Duration">foo 4 months</div>
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