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

export const useMediaQueryLaptopCheck = pixels => {
    const laptopQuery = useMediaQuery(`only screen and (min-width: 992px) and (max-width: ${pixels}px)`);
    const [isLaptop, setIsLaptop] = useState(laptopQuery);

    useEffect(() => {
        if (laptopQuery !== isLaptop) {
            setIsLaptop(laptopQuery);
        }
    }, [laptopQuery]);

    return { isLaptop };
};
