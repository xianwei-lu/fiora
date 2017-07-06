import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';

@immutableRenderDecorator
export default class Icon extends Component {
    static propTypes = {
        icon: PropTypes.string.isRequired,
        size: PropTypes.number.isRequired,
    }
    render() {
        const { icon, size } = this.props;
        return (
            <i className={`iconfont ${icon}`} style={{ fontSize: size }} />
        );
    }
}
