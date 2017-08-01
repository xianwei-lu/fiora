import React from 'react';
import PropTypes from 'prop-types';
import 'styles/component/textButton.less';

export default function TextButton({ text, onClick }) {
    return (
        <p className="component-text-button" onClick={onClick}>
            <a>{text}</a>
        </p>
    );
}
TextButton.propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func,
};
