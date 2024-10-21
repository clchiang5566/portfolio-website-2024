import { useState, useEffect } from 'react';
import { useMediaQuery } from '@react-hook/media-query';

export const useMediaQueryCheck = pixels => {
    const mobileQuery = useMediaQuery(`only screen and (max-width: ${pixels}px)`);
    const [isMobile, setIsMobile] = useState(mobileQuery);

    useEffect(() => {
        if (mobileQuery !== isMobile) {
            setIsMobile(mobileQuery);
        }
    }, [mobileQuery]);

    return { isMobile };
};
