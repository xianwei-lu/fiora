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
        width: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        height: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
    }
    static defaultProps = {
        width: 'auto',
        height: 'auto',
    }

    render() {
        const { children, center, backgroundImage, fill, width, height } = this.props;

        const props = new Props('layout-view');
        props.addClass(center, 'center');
        props.addClass(fill, 'fill');
        props.addStyle(backgroundImage, { backgroundImage: `url(${backgroundImage})` });
        props.addStyle(!fill, { width, height });

        return (
            <div {...props.value()}>{ children }</div>
        );
    }
}
