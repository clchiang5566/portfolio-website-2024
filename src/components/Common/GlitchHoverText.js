import React, { useState, useEffect, useRef } from 'react';
import { throttle } from 'lodash';
import PropTypes from 'prop-types';

const GlitchHoverText = ({ text, duration = 1500, frameInterval = 1 }) => {
    const [displayText, setDisplayText] = useState(text);
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+=-<>?';
    const animationRef = useRef(null);
    const isHovered = useRef(false);
    const startTimeRef = useRef(null);
    const frameCountRef = useRef(0);

    const randomChar = () => charset[Math.floor(Math.random() * charset.length)];

    const resetAnimation = () => {
        if (typeof window !== 'undefined') {
            cancelAnimationFrame(animationRef.current);
        }
        startTimeRef.current = null;
        setDisplayText(text);
        frameCountRef.current = 0;
    };

    const glitchTextAnimation = throttle(currentTime => {
        if (!startTimeRef.current) startTimeRef.current = currentTime;
        const elapsedTime = currentTime - startTimeRef.current;
        const progress = Math.min(elapsedTime / duration, 1);
        const textLength = text.length;
        const correctChars = Math.floor(progress * textLength);

        if (frameCountRef.current % frameInterval === 0) {
            let result = '';
            for (let i = 0; i < textLength; i++) {
                if (i < correctChars) {
                    result += text[i];
                } else {
                    result += randomChar();
                }
            }
            setDisplayText(result);
        }

        frameCountRef.current++;

        if (progress < 1) {
            if (typeof window !== 'undefined') {
                animationRef.current = requestAnimationFrame(glitchTextAnimation);
            }
        } else {
            setDisplayText(text);
        }
    }, 10);

    useEffect(() => {
        if (isHovered.current) {
            resetAnimation();
            if (typeof window !== 'undefined') {
                animationRef.current = requestAnimationFrame(glitchTextAnimation);
            }
        }
        return () => {
            if (typeof window !== 'undefined') {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [text]);

    return (
        <span
            onMouseEnter={() => {
                isHovered.current = true;
                resetAnimation();
                if (typeof window !== 'undefined') {
                    animationRef.current = requestAnimationFrame(glitchTextAnimation);
                }
            }}
            onMouseLeave={() => {
                isHovered.current = false;
                resetAnimation();
            }}
            style={{ cursor: 'pointer', display: 'inline-block' }}
        >
            {displayText}
        </span>
    );
};

GlitchHoverText.propTypes = {
    text: PropTypes.string,
    duration: PropTypes.number,
    frameInterval: PropTypes.number,
};

export default GlitchHoverText;
