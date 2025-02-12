const projectDisplay = [
    "batter_time",
    "yellow_sky",
    "doubble_dilemma",
    "gateway",
    "bonzios"
];

/**
 * build an html string from a link to image/video/...
 * @param {string} url path to image, link to video, etc.
 * @param {boolean} forceImage if true, returns an image even if media is a video
 * @returns an html element to be added to page
 */
function buildMediaElement(url, forceImage=false) {
    if (isValidURL(url)) { // is web content
        if (forceImage) {
            return `<img src="${videoProxyImg}" class="img-fluid" alt="Image">`
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
        return `${baseMediaPath}${prjId}/${mediaId}`;
    }
    return mediaId;
}