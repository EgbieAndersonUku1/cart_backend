import {findProductByIndex } from "./utils.js";


export function setLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('LocalStorage set error:', error);
    }
}


export function getLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('LocalStorage get error:', error);
        return [];
    }
}


export function removeFromLocalStorage(key, id) {
    const items      = getLocalStorage(key);
    const NOT_FOUND  = -1;

    if (items) {
        const index = findProductByIndex(items, id);
        if (index != NOT_FOUND && Array.isArray(items)) {
            items.slice(index, 1);
        }
        setLocalStorage(key, items);
    } else {
        console.log(`Attempted to remove item with id ${id} but it wasn't found.`);
    }
}


export function updateProductInLocalStorage(key, productInfo, productID) {
    const NOT_FOUND = -1;

    if (productInfo && productInfo.productIDName && productInfo.currentQty && productInfo.currentPrice) {

        const products = getLocalStorage(key);
        const index    = findProductByIndex(products, productID);
       
        const value    = {
            productIDName: productInfo.productIDName,
            currentQty: productInfo.currentQty,
            currentPrice: productInfo.currentPrice,
            selectorID: productID,
        };
        
        if (index === NOT_FOUND) {
            products.push(value);
        } else {
            products[index] = value;
        }
        
        setLocalStorage(key, products);
        
    } else {
        console.warn(`One or more fo the elements wasn't found: name: ${productInfo.productIDName}, element: ${currentProductQtyElement}, qty: ${currentQty}, price: ${currentPrice}`)
    }

}


