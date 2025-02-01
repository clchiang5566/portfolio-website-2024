import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { NextSeo } from 'next-seo';
import { wrapper } from '../../redux/store';
import Layout from '../../layout';
import data from '../../pages/api/dummypage/data.json';
import { Works } from '../../components/Works';
import { getCurrentColor } from '../../redux/works/works.selector';
import { useSelector } from 'react-redux';

const WorksPage = ({ Global, Seo }) => {
    const currentColor = useSelector(getCurrentColor);

    return (
        <Layout {...Global} color={currentColor}>
            <NextSeo title={Seo.pageTitle} description={Seo.pageDescription} canonical={Seo.pageUrl} />
            <Head>
                <link rel='shortcut icon' href={Global?.favicon?.url} />
                <meta name='title' content={Seo.pageTitle} />
                <meta name='keywords' content={Seo.pageKeywords} />
                <meta name='theme-color' content={currentColor} />
                <meta property='og:url' content={Seo.pageUrl} />
                <meta property='og:title' content={Seo.pageOgTitle} />
                <meta property='og:description' content={Seo.pageOgDescription} />
                <meta property='og:image' content={Seo.pageOgImage} />
            </Head>
            <Works />
        </Layout>
    );
};

export const getStaticProps = wrapper.getStaticProps(store => async () => {
    const Global = data.global;
    const Seo = data.SEO;

    return {
        props: {
            Global,
            Seo,
        },
    };
});

WorksPage.propTypes = {
    Global: PropTypes.object,
    Seo: PropTypes.object,
    Contents: PropTypes.array,
};

export default WorksPage;
