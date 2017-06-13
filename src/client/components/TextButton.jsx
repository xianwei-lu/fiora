import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';

import 'styles/component/textButton.less';

@pureRender
export default class TextButton extends Component {
    static propTypes = {
        text: PropTypes.string.isRequired,
        onClick: PropTypes.func,
    }
    render() {
        const { text, onClick } = this.props;

        return (
            <p className="component-text-button" onClick={onClick}>
                <a>{text}</a>
            </p>
        );
    }
}
