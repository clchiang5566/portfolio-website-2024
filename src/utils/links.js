export const isExternalLink = url => {
    const pattern = /^(((http|https|ftp):\/\/)|mailto:)/;
    return pattern.test(url);
};
