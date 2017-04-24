import React, { Component, PropTypes } from 'react';

import 'styles/component/avatar.less';
import Props from '../../utils/props';

export default class Avatar extends Component {
    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        circular: PropTypes.bool,
    }
    render() {
        const { width, height, circular } = this.props;
        const props = new Props('component-avatar');
        props.addClass(circular, 'circular');
        props.addStyle(true, { width, height });

        return (
            <img
                src="https://static.home.mi.com/app/shop/img?id=shop_b3f34b834e997bb4cc6a7e8bb17e4b41.gif&w=65&h=18&t=raw"
                {...props.value()}
            />
        );
    }
}
