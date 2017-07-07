import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';

@immutableRenderDecorator
export default class ColorIcon extends Component {
    static propTypes = {
        icon: PropTypes.string.isRequired,
        size: PropTypes.number.isRequired,
    }
    render() {
        const { icon, size } = this.props;
        switch (icon) {
        case 'safari': {
            return <img src={require('../assets/images/colorIcons/safari.svg')} width={size - 4} height={size - 4} />;
        }
        case 'osx': {
            return <img src={require('../assets/images/colorIcons/osx.svg')} width={size - 7} height={size - 7} />;
        }
        case 'ios': {
            return <img src={require('../assets/images/colorIcons/ios.svg')} width={size - 6} height={size - 6} style={{ position: 'relative', top: -1 }} />;
        }
        case 'opera': {
            return <img src={require('../assets/images/colorIcons/opera.svg')} width={size - 6} height={size - 6} />;
        }
        default: {
            break;
        }
        }
        return (
            <svg className="icon" style={{ fontSize: size }} aria-hidden="true" dangerouslySetInnerHTML={{ __html: `<use xlink:href="#${icon}" />` }} />
        );
    }
}
