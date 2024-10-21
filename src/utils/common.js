export const setBodyNoScroll = bool => {
    if (bool) {
        document.body.style.top = `-${window.scrollY}px`;
        document.body.style.position = 'fixed';
    } else {
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
};

export const checkMediaUrl = link => {
    const images = ['jpg', 'jpeg', 'jpe', 'jp2', 'svg', 'svgz', 'gif', 'png', 'webp', 'tiff', 'tif'];
    const videos = ['mp4', 'avi', 'mov', 'mpg', 'mp2'];

    if (link === null) {
        return '';
    }

    const url = new URL(link.image !== undefined ? link.image.toLowerCase() : link.toLowerCase());
    const extension = url.pathname.split('.')[1];

    if (images.includes(extension)) {
        return 'image';
    } else if (videos.includes(extension)) {
        return 'video';
    }
};

export const stringToKey = str => str.replace(/\s+/g, '_').toLowerCase();

export const scrollToTargetOffset = (el, offset = 0) => {
    const elPosition = el.getBoundingClientRect().top;
    const offsetPosition = elPosition + window.pageYOffset - offset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
    });
};

export const lerp = (v0, v1, t) => v0 * (1 - t) + v1 * t;

// Returns an array of decreasing index values in a pyramid shape, starting from the specified index with the highest value. These indices are often used to create overlapping effects among elements.
export const getPiramidalIndex = (array, index) =>
    array.map((_, i) => (index === i ? array.length : array.length - Math.abs(index - i)));

export const lightenHex = (hex, amount) => {
    hex = hex.replace('#', '');
    const r = Math.min(255, parseInt(hex.substring(0, 2), 16) + amount);
    const g = Math.min(255, parseInt(hex.substring(2, 4), 16) + amount);
    const b = Math.min(255, parseInt(hex.substring(4, 6), 16) + amount);

    return (
        '#' +
        [r, g, b]
            .map(x => {
                const hex = x.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            })
            .join('')
    );
};
