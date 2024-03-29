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