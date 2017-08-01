import React from 'react';
import PropTypes from 'prop-types';

export default function ColorIcon({ icon, size }) {
    switch (icon) {
    case 'icon-safari': {
        return <img src={require('../assets/images/colorIcons/safari.svg')} width={size} height={size} />;
    }
    case 'icon-osx': {
        return <img src={require('../assets/images/colorIcons/osx.svg')} width={size - 3} height={size - 3} />;
    }
    case 'icon-ios': {
        return <img src={require('../assets/images/colorIcons/ios.svg')} width={size - 2} height={size - 2} style={{ position: 'relative', top: -1 }} />;
    }
    case 'icon-opera': {
        return <img src={require('../assets/images/colorIcons/opera.png')} width={size} height={size} />;
    }
    default: {
        break;
    }
    }
    return (
        <svg className="icon" style={{ fontSize: size }} aria-hidden="true" dangerouslySetInnerHTML={{ __html: `<use xlink:href="#${icon}" />` }} />
    );
}
ColorIcon.propTypes = {
    icon: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
};
