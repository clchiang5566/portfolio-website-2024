import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import 'normalize.css';
import Head from 'next/head';
// import { PersistGate } from 'redux-persist/integration/react';
import { Provider, useStore } from 'react-redux';

// import TagManager from 'react-gtm-module';
//* Redux Store
import { wrapper } from '../redux/store';
//* Style
import '../styles/global.scss';
import '../styles/fonts.scss';
import '../styles/icon.scss';
import '../styles/form.scss';
import BackgroundMusic from '../components/Common/BackgroundMusic';

const MyApp = ({ Component, pageProps }) => {
    const store = useStore(state => state);

    useEffect(() => {
        // TagManager.initialize({ gtmId: 'GTM-K22B94M' });
    }, []);

    return (
        <Provider store={store}>
            <Head>
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=0, viewport-fit=cover'
                />
            </Head>
            <Component {...pageProps} />
            <BackgroundMusic />
        </Provider>
    );
};

MyApp.getInitialProps = async ({ Component, ctx }) => {
    const { res } = ctx;
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
    if (res) {
        res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    }

    return { pageProps: pageProps };
};

MyApp.propTypes = {
    Component: PropTypes.func,
    pageProps: PropTypes.object,
};

export default wrapper.withRedux(MyApp);
