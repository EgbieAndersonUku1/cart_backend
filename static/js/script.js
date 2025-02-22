// This is a global script file for shared functionality across multiple pages, 
// containing scripts that are not specific to any single page.


import { closeMessageIcon} from "./messages.js";


// event listener
window.addEventListener("pageshow", handlePageShow);


/**
 * Listens for the 'pageshow' event to detect when the page is restored from the cache.
 * If the page was loaded from the bfcache (back-forward cache), it forces a reload 
 * to ensure the cart data is up to date.
 */
function handlePageShow(e) {
    if (e.persisted) {
        console.log("Page restored from cache. Reloading cart...");
        this.location.reload();
    }
}


window.addEventListener("click", handleCloseIcon)


function handleCloseIcon(e) {
    const messageCloseIconID = e.target.id;
    if (e.target.id === messageCloseIconID) {
        closeMessageIcon();
    }
}