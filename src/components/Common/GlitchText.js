import { useEffect, useRef } from 'react';
import { throttle } from 'lodash';

const GlitchText = ({ text, duration = 1500, frameInterval = 1, onUpdate }) => {
    // const [displayText, setDisplayText] = useState('');
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+=-<>?';
    const animationRef = useRef(null);
    const startTimeRef = useRef(null);
    const frameCountRef = useRef(0);

    const randomChar = () => charset[Math.floor(Math.random() * charset.length)];

    const resetAnimation = () => {
        cancelAnimationFrame(animationRef.current);
        startTimeRef.current = null;
        // setDisplayText('');
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
                if (text[i] === '\n') {
                    result += '\n';
                } else if (i < correctChars) {
                    result += text[i];
                } else {
                    result += randomChar();
                }
            }
            // setDisplayText(result);
            if (onUpdate) onUpdate(result);
        }

        frameCountRef.current++;

        if (progress < 1) {
            animationRef.current = requestAnimationFrame(glitchTextAnimation);
        } else {
            // setDisplayText(text);
            if (onUpdate) onUpdate(text);
        }
    }, 10);

    useEffect(() => {
        if (!text) return;
        resetAnimation();
        animationRef.current = requestAnimationFrame(glitchTextAnimation);
        return () => cancelAnimationFrame(animationRef.current);
    }, [text]);

    return null;
};

export default GlitchText;
