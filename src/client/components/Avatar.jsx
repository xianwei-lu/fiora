import React from 'react';
import PropTypes from 'prop-types';
import 'styles/component/avatar.less';

export default function Avatar({ width, height, circular, src }) {
    if (/suisuijiang.com/.test(src) && !/imageView2/.test(src)) {
        src = `${src}?imageView2/2/w/${width}/h/${height}`;
    }

    return (
        <img
            className={`component-avatar ${circular ? 'circular' : ''}`}
            src={src}
            width={width}
            height={height}
        />
    );
}
Avatar.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    circular: PropTypes.bool,
    src: PropTypes.string.isRequired,
};
