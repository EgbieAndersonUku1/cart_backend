

/**
 * Splits a string using a specified delimiter.
 * @param {string} text - The text to be split.
 * @param {string} [delimiter="-"] - The delimiter to use for splitting. Defaults to "-".
 * @returns {string[]} - An array of substrings.
 */
export function splitText(text, delimiter = "-") {
    return text ? text.split(delimiter) : [];
}


/**
 * Concatenates two strings with a delimiter in between.
 * @param {string} first     - The first string.
 * @param {string} second    - The second string.
 * @param {string} delimiter - The delimiter to use if none is provide concatenates the two strings.
 * @returns {string}         - The concatenated string.
 */
export function concatenateWithDelimiter(first, second, delimiter = "") {
    return `${first}${delimiter}${second}`;
}


export function checkIfHTMLElement(element, elementName = "Unknown") {
    if (!(element instanceof HTMLElement)) {
        console.error(`Could not find the element: '${elementName}'. Ensure the selector is correct.`);
        return false;
    }
    return true;
}


/**
 * Toggles the visibility of the spinner.
 * 
 * This function shows or hides the spinner by setting its display property to either 'block' or 'none'.
 * 
 * @param {boolean} [show=true] - A boolean indicating whether to show or hide the spinner.
 *                               If `true`, the spinner is shown; if `false`, it is hidden.
 */
export function toggleSpinner(show=true) {
    spinner.style.display = show ? "block" : "none";
}



export function showPopup(element, duration=500) {
    element.classList.add("popup");

    setTimeout(() => {
        element.classList.remove("popup");
    }, duration);

}



export function findProductByIndex(products, selectorID) {
    return products.findIndex((product) => product.selectorID === selectorID);
        
}


export function updateCartQuantityDisplay(selector, valueToUpdateWith) {

    const productElement = document.getElementById(selector);
 
    if (!checkIfHTMLElement(productElement, valueToUpdateWith)) {
         return false;
    }
    
    productElement.textContent = valueToUpdateWith;
    return true;
    
 }
 