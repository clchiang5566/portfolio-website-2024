import React from 'react';
import style from './WorksDetail.module.scss';
import { SmartLink } from '../SmartLink';
import Player from '../Player';
import { BodyCopy, Subtitle } from '../Common/Text';
import { Images } from './Images';
import PropTypes from 'prop-types';

export function Block ({ type, headline, video, images, content, text, relevant, color, ...props }) {
    return (
        <>
            {type === 'text' ? (
                <section className={style.text}>
                    <p>
                        <BodyCopy>{text}</BodyCopy>
                    </p>
                </section>
            ) : type === 'title' ? (
                <section className={style.text}>
                    <h3>
                        <Subtitle wobble>{text}</Subtitle>
                    </h3>
                </section>
            ) : type === 'info' ? (
                <section className={style.info}>
                    <h3>
                        <Subtitle wobble>{headline}</Subtitle>
                    </h3>
                    <div className={style.items}>
                        {content.map((info, l) => (
                            <div className={style.row} key={l}>
                                <div className={style.line}>
                                    <p>
                                        <BodyCopy>{info.label}</BodyCopy>
                                    </p>
                                </div>
                                <div className={style.line}>
                                    <p>
                                        <BodyCopy>{info.value}</BodyCopy>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ) : type === 'video' ? (
                <section className={style.video}>
                    <h3>
                        <Subtitle wobble>{video.headline}</Subtitle>
                    </h3>
                    <section className={style.player}>
                        <Player link={video?.url} />
                        <section className={style.frame} />
                    </section>
                    <div className={style.deco}>
                        <svg fill='none' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 482 41' role='presentation'>
                            <path
                                vectorEffect='non-scaling-stroke'
                                d='M478.755 2.994a7.234 7.234 0 0 0-10.222.255l-18.041 18.975-18.041-18.975A7.234 7.234 0 0 0 427.213 1a7.214 7.214 0 0 0-5.238 2.25l-18.041 18.974-18.041-18.975A7.243 7.243 0 0 0 380.655 1a7.217 7.217 0 0 0-5.239 2.25l-18.041 18.974-18.041-18.975A7.241 7.241 0 0 0 334.096 1a7.214 7.214 0 0 0-5.238 2.25l-18.041 18.974-18.041-18.975A7.243 7.243 0 0 0 287.538 1a7.217 7.217 0 0 0-5.239 2.25l-18.04 18.974-18.031-18.97a7.243 7.243 0 0 0-5.238-2.249c-1.98 0-3.877.811-5.239 2.25l-18.036 18.974-18.04-18.975a7.237 7.237 0 0 0-5.239-2.249 7.214 7.214 0 0 0-5.238 2.25l-18.036 18.974-18.041-18.975a7.234 7.234 0 0 0-5.238-2.249 7.213 7.213 0 0 0-5.238 2.25l-18.036 18.974-18.041-18.975a7.243 7.243 0 0 0-5.238-2.249c-1.98 0-3.877.811-5.239 2.25L78.055 22.223 60.02 3.254a7.243 7.243 0 0 0-5.239-2.249 7.215 7.215 0 0 0-5.238 2.25L31.507 22.223l-18.04-18.97a7.223 7.223 0 0 0-10.217-.26c-2.897 2.75-3.01 7.33-.26 10.222l23.279 24.483a7.243 7.243 0 0 0 5.238 2.25 7.215 7.215 0 0 0 5.238-2.25l18.036-18.97L72.817 37.7a7.243 7.243 0 0 0 5.238 2.25c1.98 0 3.877-.812 5.239-2.25l18.036-18.974 18.04 18.974a7.245 7.245 0 0 0 5.239 2.25 7.214 7.214 0 0 0 5.238-2.25l18.036-18.974 18.036 18.974a7.243 7.243 0 0 0 5.238 2.25 7.214 7.214 0 0 0 5.238-2.25l18.036-18.974 18.036 18.974a7.234 7.234 0 0 0 5.238 2.25 7.217 7.217 0 0 0 5.239-2.25l18.035-18.974 18.041 18.974a7.243 7.243 0 0 0 5.239 2.25 7.214 7.214 0 0 0 5.238-2.25l18.041-18.974 18.041 18.974a7.243 7.243 0 0 0 5.238 2.25 7.214 7.214 0 0 0 5.238-2.25l18.041-18.974 18.041 18.974a7.243 7.243 0 0 0 5.238 2.25 7.217 7.217 0 0 0 5.239-2.25l18.041-18.974 18.04 18.974a7.245 7.245 0 0 0 5.239 2.25 7.214 7.214 0 0 0 5.238-2.25l18.041-18.974 18.041 18.974a7.234 7.234 0 0 0 5.238 2.25 7.217 7.217 0 0 0 5.239-2.25l23.279-24.483a7.234 7.234 0 0 0-.255-10.222Z'
                                fill='#fff'
                                stroke='#313131'
                                strokeMiterlimit='10'
                            />
                        </svg>
                    </div>
                </section>
            ) : type === 'images' ? (
                <section className={style.images}>
                    {images.map((img, j) => (
                        <section className={style.image} key={j}>
                            <Images src={img.image.url} alt={img.image?.alt} color={color} />
                        </section>
                    ))}
                </section>
            ) : type === 'links' ? (
                <section className={style.links}>
                    <h3>
                        <Subtitle wobble>{relevant.headline}</Subtitle>
                    </h3>
                    <div className={style.content}>
                        {relevant.content.map((link, k) => (
                            <div className={style.link} key={k}>
                                <SmartLink href={link.link}>{link.text}</SmartLink>
                            </div>
                        ))}
                    </div>
                </section>
            ) : (
                <p />
            )}
        </>
    );
}

Block.propTypes = {
    type: PropTypes.string,
    headline: PropTypes.string,
    video: PropTypes.object,
    images: PropTypes.array,
    content: PropTypes.array,
    text: PropTypes.string,
    relevant: PropTypes.any,
    color: PropTypes.string,
};
