import { checkIfHTMLElement } from "./utils.js";

const messageElement   = document.querySelector("#popup-message .message");
const messagePopupBox  = document.getElementById("popup-message");
const messageCloseIcon = document.getElementById("message-pop-close-icon");


validateMessages();

function validateMessages() {
    
    if (!checkIfHTMLElement(messageElement, "message")) {
        return;
    }

    if (!checkIfHTMLElement(messagePopupBox, "message popup box")) {
        return;
    };

    if (!checkIfHTMLElement(messageCloseIcon, "The message close icon")) {
        return;
    };


}


export function showPopupMessage(message, timeInMsToDisplay=15000) {

    if (!message) {
        console.error("Expected a message but received None.");
    };

    messageElement.textContent = message;
    toggleMessageBoxHelper()

    setTimeout(() => {
        toggleMessageBoxHelper(false);
    }, timeInMsToDisplay);
}


export function closeMessageIcon() {
    toggleMessageBoxHelper(false)
}


function toggleMessageBoxHelper(show=true) {
    show ? messagePopupBox.classList.add("show") : messagePopupBox.classList.remove("show");
}