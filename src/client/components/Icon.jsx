import React from 'react';
import PropTypes from 'prop-types';

export default function Icon({ icon, size }) {
    return (
        <i className={`iconfont ${icon}`} style={{ fontSize: size }} />
    );
}
Icon.propTypes = {
    icon: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
};
