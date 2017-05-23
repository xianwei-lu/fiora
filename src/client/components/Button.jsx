import React, { Component, PropTypes } from 'react';

import 'styles/component/button.less';
import Props from '../../utils/props';

export default class Button extends Component {
    static propTypes = {
        text: PropTypes.string,
    }

    render() {
        const { text, onClick } = this.props;

        // const props = new Props('component-button');
        // props.addClass(center, 'center');
        // props.addClass(fill, 'fill');
        // props.addStyle(backgroundImage, { backgroundImage: `url(${backgroundImage})` });

        return (
            <div>{ text }</div>
        );
    }
}
