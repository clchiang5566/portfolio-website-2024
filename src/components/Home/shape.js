/* eslint-env browser */
import React, { useRef, useEffect, useState } from 'react';
import { spline } from './spline';
import { createNoise2D } from 'simplex-noise';
import style from './Home.module.scss';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectIsFloating } from '../../redux/home/home.selector';

const Shape = ({ isLoaded, handleClick }) => {
    const notInitial = useRef(false);
    const requestId = useRef();
    const [path, setPath] = useState(null);
    const isFloating = useSelector(selectIsFloating);
    let noiseStep = 0.003;

    const map = (n, start1, end1, start2, end2) => {
        return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
    };

    const noise = (x, y) => {
        return simplex(x, y);
    };

    const createPoints = () => {
        const points = [];
        const numPoints = 7;
        const angleStep = (Math.PI * 2) / numPoints;
        const rad = 80;

        for (let i = 1; i <= numPoints; i++) {
            const theta = i * angleStep;
            const x = 100 + Math.cos(theta) * rad;
            const y = 100 + Math.sin(theta) * rad;

            points.push({
                x: x,
                y: y,
                originX: x,
                originY: y,
                noiseOffsetX: Math.random() * 1000,
                noiseOffsetY: Math.random() * 1000,
            });
        }
        return points;
    };

    const simplex = createNoise2D();
    const points = createPoints();

    const animate = () => {
        setPath(spline(points, 1, true));

        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            const nX = noise(point.noiseOffsetX, point.noiseOffsetX);
            const nY = noise(point.noiseOffsetY, point.noiseOffsetY);
            const x = map(nX, -1, 1, point.originX - 20, point.originX + 20);
            const y = map(nY, -1, 1, point.originY - 20, point.originY + 20);
            point.x = x;
            point.y = y;
            point.noiseOffsetX += noiseStep;
            point.noiseOffsetY += noiseStep;
        }

        if (typeof window !== 'undefined') {
            requestId.current = requestAnimationFrame(animate);
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            requestId.current = requestAnimationFrame(animate);
        }
        return () => {
            if (typeof window !== 'undefined') {
                cancelAnimationFrame(requestId.current);
            }
        };
    }, []);

    useEffect(() => {
        const face = document.querySelector('.bg');
        if (face) {
            face.addEventListener('mousemove', () => {
                noiseStep = 0.012;
            });
            face.addEventListener('touchstart', () => {
                noiseStep = 0.012;
            });
            face.addEventListener('mouseleave', () => {
                noiseStep = 0.003;
            });
            face.addEventListener('touchend', () => {
                noiseStep = 0.003;
            });
        }
    }, [isLoaded]);

    return (
        <div
            className={[style.shape, 'bg', isFloating ? style.animation : null].join(' ')}
            ref={notInitial}
            onClick={() => handleClick()}
        >
            <svg viewBox='0 0 210 210'>
                <path id='wavepath' d={path} fillOpacity='0%' />
                <text textAnchor='middle'>
                    <textPath href='#wavepath' startOffset='0%'>
                        <animate
                            attributeName='startOffset'
                            from='150%'
                            to='-50%'
                            begin='0s'
                            dur='12s'
                            repeatCount='indefinite'
                        />
                        A Freelance Creative Developer Who Is Studying And Traveling Hard This Year. A Freelance
                        Creative Developer Who Is Studying And Traveling Hard This Year.
                    </textPath>
                </text>
            </svg>
        </div>
    );
};

Shape.propTypes = {
    isLoaded: PropTypes.bool,
    handleClick: PropTypes.func,
};

export default Shape;
