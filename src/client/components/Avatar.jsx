import React, { Component } from 'react';
import PropTypes from 'prop-types';

import 'styles/component/avatar.less';
import Props from '../../utils/props';

export default class Avatar extends Component {
    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        circular: PropTypes.bool,
        src: PropTypes.string.isRequired,
    }
    render() {
        const { width, height, circular, src } = this.props;

        const props = new Props({ src });
        props.addClass(true, 'component-avatar');
        props.addClass(circular, 'circular');
        props.addStyle(true, { width, height });

        return (
            <img {...props.value()} />
        );
    }
}
