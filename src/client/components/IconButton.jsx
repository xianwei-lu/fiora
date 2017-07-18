import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import { Button } from 'antd';

import Icon from 'components/Icon';

import 'styles/component/iconButton.less';

@immutableRenderDecorator
export default class IconButton extends Component {
    static propTypes = {
        icon: PropTypes.string.isRequired,
        size: PropTypes.number.isRequired,
        noBorder: PropTypes.bool.isRequired,
        onClick: PropTypes.func,
    }
    static defaultProps = {
        noBorder: false,
    }
    render() {
        const { icon, size, noBorder, onClick, ...props } = this.props;
        return (
            <Button className={`component-icon-button ${noBorder ? 'no-border' : ''}`} shape="circle" onClick={onClick} {...props}>
                <Icon icon={icon} size={size} />
            </Button>
        );
    }
}
