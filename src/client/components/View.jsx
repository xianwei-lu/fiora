import React, { Component, PropTypes } from 'react';

import 'styles/component/view.less';
import Props from '../../utils/props';

export default class View extends Component {
    static propTypes = {
        children: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.array,
            PropTypes.string,
        ]),
        center: PropTypes.bool,
        backgroundImage: PropTypes.string,
        fill: PropTypes.bool,
    }

    render() {
        const { children, center, backgroundImage, fill } = this.props;

        const props = new Props('layout-view');
        props.addClass(center, 'center');
        props.addClass(fill, 'fill');
        props.addStyle(backgroundImage, { backgroundImage: `url(${backgroundImage})` });

        return (
            <div {...props.value()}>{ children }</div>
        );
    }
}
