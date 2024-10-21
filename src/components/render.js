import React from 'react';

// components
import HomePage from './HomePage';

export const render = (component, i) => {
    const key = i;
    let props;
    let Component = null;

    switch (component.type) {
        case 'homepage':
            props = {
                ...component,
            };
            Component = HomePage;
            break;
        default:
    }

    if (Component) {
        return <Component key={key} {...props} />;
    }
    return null;
};
