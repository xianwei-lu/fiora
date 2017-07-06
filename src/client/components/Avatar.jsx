import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';

import 'styles/component/avatar.less';
import Props from '../../utils/props';

@immutableRenderDecorator
export default class Avatar extends Component {
    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        circular: PropTypes.bool,
        src: PropTypes.string.isRequired,
    }
    render() {
        const { width, height, circular } = this.props;
        let src = this.props.src;
        if (/suisuijiang.com/.test(src) && !/imageView2/.test(src)) {
            src = `${src}?imageView2/2/w/${width}/h/${height}`;
        }

        const props = new Props({ src });
        props.addClass(true, 'component-avatar');
        props.addClass(circular, 'circular');
        props.addStyle(true, { width, height });

        return (
            <img {...props.value()} />
        );
    }
}
