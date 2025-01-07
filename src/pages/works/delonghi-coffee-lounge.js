import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { NextSeo } from 'next-seo';
import { wrapper } from '../../redux/store';
import Layout from '../../layout';
// import { getPage } from '../redux/page/page.action';
// import { pageGetData } from '../redux/page/page.selector';
import data from '../../pages/api/dummypage/data.json';
import WorksDetail from '../../components/WorksDetail';
import Contents from '../../pages/api/data/delonghi';
import { setCurrentColor, setIsPoster, setCurrentIndex, setPageContent } from '../../redux/works/works.action';
import { getCurrentColor, getCurrentIndex, getIsPoster, getPageContent } from '../../redux/works/works.selector';
// import { useSelector, useDispatch } from 'react-redux';
import { useDispatch } from 'react-redux';

const WorksDetailPage = ({ Global, Seo }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setCurrentColor(Contents.color));
        dispatch(setCurrentIndex(Contents.index));
        dispatch(setPageContent(Contents));
        dispatch(setIsPoster(true));
    }, [dispatch]);

    return (
        <Layout {...Global} color={Contents.color}>
            <NextSeo title={Seo.pageTitle} description={Seo.pageDescription} canonical={Seo.pageUrl} />
            <Head>
                <link rel='shortcut icon' href={Global?.favicon?.url} />
                <meta name='title' content={Seo.pageTitle} />
                <meta name='keywords' content={Seo.pageKeywords} />
                <meta name='theme-color' content={Contents.color} />
                <meta property='og:url' content={Seo.pageUrl} />
                <meta property='og:title' content={Seo.pageOgTitle} />
                <meta property='og:description' content={Seo.pageOgDescription} />
                <meta property='og:image' content={Seo.pageOgImage} />
            </Head>
            <WorksDetail {...Contents} />
        </Layout>
    );
};

export const getStaticProps = wrapper.getStaticProps((store) => () => {
    const Global = data.global;
    const Seo = data.SEO;
    console.log('Dispatching actions with contents:', Contents);
    store.dispatch(setCurrentColor(Contents.color));
    store.dispatch(setCurrentIndex(Contents.index));
    store.dispatch(setPageContent(Contents));
    store.dispatch(setIsPoster(true));
    console.log('Actions dispatched, returning props:', { Global, Seo });
    return {
        props: {
            Global,
            Seo,
        },
    };
});

WorksDetailPage.propTypes = {
    Global: PropTypes.object,
    Seo: PropTypes.object,
};

export default WorksDetailPage;
