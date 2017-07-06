import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';

import 'styles/component/textButton.less';

@immutableRenderDecorator
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
