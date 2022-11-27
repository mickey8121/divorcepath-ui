export const encodeValueForLink = str => str && encodeURIComponent(str.toLowerCase());

export const decodeValueFromLink = str => str && decodeURIComponent(str);
