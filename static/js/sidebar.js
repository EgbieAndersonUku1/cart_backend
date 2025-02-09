import { checkIfHTMLElement, toggleSpinner } from "./utils.js";

const windowCloseIcon      = document.getElementById("window-icon");
const saveSideBar          = document.getElementById("save-sidebar");
const spinner              = document.getElementById("spinner");
const sideBarSaveContainer = document.querySelector(".save-container");

const DISPLAY_CLASS       = "show";
const HIDE_CLASS          = "hide";


export function handleSaveSidebar(e) {
    
    const target          = e.target;
    const SAVE_SPAN_CLASS = "save-quantity";
    const WINDOW_ID       = "window-icon";
    const SAVE_ID         = "save";
    const ALT             = "save icon"; // image
    const isValid         = target.classList.contains(SAVE_SPAN_CLASS) || target.id == SAVE_ID || target.id == WINDOW_ID;

    if (isValid || target.alt == ALT) {
        toggleSaveSideBar();
    };

};


export function toggleSaveSideBar() {
    if (checkIfHTMLElement(saveSideBar)) {

        const TIME_IN_MILLSECONDS = 500;
        const DISPLAY             = "show";
        const isSideBarVisible    = saveSideBar.classList.contains(DISPLAY); 
        
        toggleSpinner(spinner);

        setTimeout(() => {
            hideSidebarAndSaveContainer(isSideBarVisible); 
            toggleSpinner(spinner, false);
        }, TIME_IN_MILLSECONDS);
       

    } else  {
        console.error(`The sidebar or close icon is invalid - Expected selectors but got: Save sidebar - ${saveSideBar}, window close icon: ${windowCloseIcon} `)
    }
}


function showSideBar() {
    saveSideBar.classList.remove(DISPLAY_CLASS);
    windowCloseIcon.classList.add(HIDE_CLASS);
    
}


function hideSidebarAndSaveContainer(show) { 
  
    const openSideBarContainer = !show;
    if (show) {
       showSideBar();
       toggleSideBarContainer(openSideBarContainer);
    } else {
        hideSideBar();
        console.log("Sidebar container should be closed here");
        toggleSideBarContainer(openSideBarContainer);
    }
    
}


function hideSideBar() {
    saveSideBar.classList.add(DISPLAY_CLASS);
    windowCloseIcon.classList.remove(HIDE_CLASS);
}


function toggleSideBarContainer(show) {
    if (!checkIfHTMLElement(sideBarSaveContainer, "Save sidebar container")) return;

    const DISPLAY = show ? "block" : "none";
    sideBarSaveContainer.style.display  = DISPLAY;

}

