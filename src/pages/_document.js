import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import _ from 'lodash';

import httpAuthCheck from '../utils/httpAuthCheck';
import { internalInstance } from '../utils/httpinstance';

class MyDocument extends Document {
    render () {
        return (
            <Html>
                <Head>
                    <link rel='preconnect' href='https://fonts.googleapis.com' />
                    <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin />
                    <link
                        href='https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400&family=Montserrat:wght@100..900&family=Rationale&display=swap'
                        rel='stylesheet'
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

MyDocument.getInitialProps = async ctx => {
    const { req, res } = ctx;
    if (process.env.BASIC_AUTH_CREDENTIALS && process.env.BASIC_AUTH_CREDENTIALS.length > 0) {
        await httpAuthCheck(req, res);
    }

    const { asPath } = ctx;

    await internalInstance
        .get(`/api/redirect?path=${encodeURIComponent(asPath)}`)
        .then(res => {
            if (res.data && res.data.redirect) {
                ctx.res.writeHead(301, {
                    location: _.trimEnd(res.data.redirectUrl),
                });
                ctx.res.end();
            }
        })
        .catch(() => {});

    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
};

export default MyDocument;
