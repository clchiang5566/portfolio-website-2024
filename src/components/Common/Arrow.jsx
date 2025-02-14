import React, { useState, useEffect } from 'react';
import { animateScroll as scroll } from 'react-scroll';

const Arrow = ({ isAbout, isWorks }) => {
    const [isUp , setIsUp] = useState();

    const scrollToTop = () => {
        if (isUp && !isAbout) {
            scroll.scrollToTop({
                duration: 1500,
            });
        }
    };    

    useEffect(() => {
        if (!isWorks) {
        let prevScrollpos = window.scrollY;

        const handleWindowScroll = () => {
            const currentScrollPos = window.scrollY;
            const windowHeight = window.innerHeight;

            if (currentScrollPos > windowHeight) {
                setIsUp(true);
            } else {
                setIsUp(false);
            }

            prevScrollpos = currentScrollPos;
        };

        window.addEventListener('scroll', () => handleWindowScroll());

        return () => {
            window.removeEventListener('scroll', () => handleWindowScroll());
        };
        }
    }, []);

    return (
        <div className={['arrow', isUp ? 'arrow-guide' : null, isAbout ? 'arrow-pause' : null].join(' ')} onClick={scrollToTop}>
            <div className={['arrow-line', isUp ? 'arrow-up' : null].join(' ')} />
        </div>
    )
};

export default Arrow;
