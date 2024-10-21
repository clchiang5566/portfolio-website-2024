import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

import { isExternalLink } from '../../utils/links';

export const SmartLink = props => {
    const { href = '', children, ...restProps } = props;
    const external = isExternalLink(href);

    if (href === '' || !href) {
        return (
            <a disabled tabIndex='-1'>
                {children}
            </a>
        );
    }

    if (external) {
        return (
            <a {...restProps} href={href} target='_blank' rel='noopener noreferrer'>
                {children}
            </a>
        );
    }

    if (href !== '') {
        return <Link href={href.trimEnd('/')}>{children}</Link>;
    }

    return (
        <a {...restProps} href={href}>
            {children}
        </a>
    );
};

SmartLink.propTypes = {
    href: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    as: PropTypes.string,
    children: PropTypes.node,
};
