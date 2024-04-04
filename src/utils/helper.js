import JSBI from "jsbi";
import { toast } from "react-toastify";


export const showError = (error) => {
    let errorMessage;

    // Check if error is a string
    if (typeof error === "string") {
        errorMessage = error;
    }
    // Check if error is an instance of Error
    else if (error instanceof Error) {
        errorMessage = error.message;
    }
    // Check if error is an object and has a message property
    else if (typeof error === "object" && error.message) {
        errorMessage = error.message;
    }
    // If error is an object but has no message property, stringify the object
    else if (typeof error === "object") {
        errorMessage = JSON.stringify(error);
    }
    // If error is of an unknown type, use a generic message
    else {
        errorMessage = "An unknown error occurred.";
    }

    toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        theme: 'light',
        progress: undefined,
    });
}

export function showSuccessToast(content) {
    toast?.success(content, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        theme: 'light',
        progress: undefined,
    });
}

export function showWarnToast(content) {
    toast?.warn(content, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
        progress: undefined,
    });
}

export function formatAddress(address, visibleLength = 3) {
    if (!address) {
        return '---';
    }

    if (address.length < visibleLength * 2) {
        return address;
    }

    let begin = address.substring(0, visibleLength);
    let end = address.substring(address.length - visibleLength);
    let str = begin + '...' + end;

    return str;
}

export function formatNumberWithCommas(number) {
    const parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return parts.join(".");
}


export const getDisplayNumber = (srcNumber, decimal) => {
    if (isNaN(srcNumber) || isNaN(decimal) || srcNumber === null || srcNumber === undefined) {
        return '---';
    }

    if (!decimal || decimal == 0) {
        return formatNumberWithCommas(srcNumber.toString());
    }

    const number = JSBI.BigInt(srcNumber);
    const decimals = JSBI.BigInt(Math.pow(10, decimal));
    const value = JSBI.divide(number, decimals);

    const fraction = JSBI.remainder(number, decimals);
  
    const formattedDecimalPart = (!JSBI.equal(fraction, JSBI.BigInt(0))) ? `.${fraction.toString().padStart(decimal, "0")}` : '';
    const displayValue = `${value.toString()}${formattedDecimalPart}`


    return formatNumberWithCommas(displayValue);
}