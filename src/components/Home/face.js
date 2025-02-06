import React, { useRef, useEffect, useState } from 'react';
import style from './Home.module.scss';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectIsFloating, selectIsActive } from '../../redux/home/home.selector';

const Face = ({ event, isLoaded, isScrollDown, setIsScrollDown }) => {
    const plane = useRef(null);
    const eyeballs = [];
    const [isShow, setIsShow] = useState(false);
    eyeballs[0] = useRef(null);
    eyeballs[1] = useRef(null);
    const maxRotate = 60;
    const isFloating = useSelector(selectIsFloating);
    const isActive = useSelector(selectIsActive);

    useEffect(() => {
        let x, y, xx, yy;
        const e = event;

        if (e.pointerType === 'touch' || e.pointerType === 'mouse' || e.pointerType === 'pen') {
            x = e.clientX / window.innerWidth;
            y = e.clientY / window.innerHeight;
            xx = (e.clientX * 100) / window.innerWidth + '%';
            yy = (e.clientY * 100) / window.innerHeight + '%';
        }

        const perspective = window.innerWidth * 3;
        const rotateX = maxRotate * x - maxRotate / 2;
        const rotateY = (maxRotate * y - maxRotate / 2) * -1;
        plane.current.style.transform = `perspective(${perspective}px) rotateX(${rotateY}deg) rotateY(${rotateX}deg)`;

        for (let i = 0; i < 2; i++) {
            eyeballs[i].current.style.left = xx;
            eyeballs[i].current.style.top = yy;
            eyeballs[i].current.style.transform = `translate(-${xx}, -${yy})`;
        }
    }, [event]);

    useEffect(() => {
        if (isLoaded) {
            setTimeout(() => {
                setIsShow(true);
            }, 300);
        }
    }, [isLoaded]);

    return (
        <div className={[style.face, 'face', isShow ? style.show : null].join(' ')}>
            <div
                className={[style.eye, isActive ? style.activeLeft : isFloating ? style.floatingLeft : null].join(' ')}
            >
                <div className={style.color} ref={eyeballs[0]}>
                    <div className={style.pupil}>
                        <div className={style.shadow} />
                        <div className={style.pupilInner}>
                            <div className={style.circle1} />
                            <div className={style.circle2} />
                        </div>
                    </div>
                </div>
            </div>
            <div
                className={[style.eye, isActive ? style.activeRight : isFloating ? style.floatingRight : null].join(
                    ' '
                )}
            >
                <div className={style.color} ref={eyeballs[1]}>
                    <div className={style.pupil}>
                        <div className={style.shadow} />
                        <div className={style.pupilInner}>
                            <div className={style.circle1} />
                            <div className={style.circle2} />
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.deco} ref={plane}>
                <div className={[style.beardTop, style.left].join(' ')}>2</div>
                <div className={[style.beardTop, style.right].join(' ')}>2</div>
                <div className={[style.beardBottom, style.left].join(' ')}>2</div>
                <div className={[style.beardBottom, style.right].join(' ')}>2</div>
                <div className={[style.horn, style.left].join(' ')}>4</div>
                <div className={[style.horn, style.right].join(' ')}>4</div>
                <div className={style.nose}>(((</div>
                <div className={style.mouth}>
                    ω<span className={style.tongue} />
                </div>
                <div className={[style.star, style.star1].join(' ')} />
                <div className={[style.star, style.star2].join(' ')} />
                <div className={[style.star, style.star3].join(' ')} />
                <div className={[style.star, style.star4].join(' ')} />
                <div className={[style.star, style.star5].join(' ')} />
            </div>
        </div>
    );
};

Face.propTypes = {
    event: PropTypes.any,
    isLoaded: PropTypes.bool,
};

export default Face;
