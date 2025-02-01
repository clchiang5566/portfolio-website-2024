import React from 'react';
import PropTypes from 'prop-types';
// import TagManager from 'react-gtm-module';
import Header from '../components/Header';

const Layout = ({ header, color, children }) => {
    // useEffect(() => {
    //     const tagManagerArgs = {
    //         gtmId: 'GTM-K22B94M',
    //     };
    //     TagManager.initialize(tagManagerArgs);
    // });

    return (
        <>
            <Header {...header} />
            <main className='main-content' style={{ backgroundColor: `${color}` }}>
                {children}
            </main>
        </>
    );
};

Layout.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    header: PropTypes.object,
    color: PropTypes.string,
    // ga_id: PropTypes.string,
};

export default Layout;
