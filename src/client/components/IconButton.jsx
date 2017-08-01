import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import Icon from 'components/Icon';
import 'styles/component/iconButton.less';

export default function IconButton({ icon, size, noBorder, onClick, ...props }) {
    return (
        <Button className={`component-icon-button ${noBorder ? 'no-border' : ''}`} shape="circle" onClick={onClick} {...props}>
            <Icon icon={icon} size={size} />
        </Button>
    );
}
IconButton.propTypes = {
    icon: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    noBorder: PropTypes.bool.isRequired,
    onClick: PropTypes.func,
};
IconButton.defaultProps = {
    noBorder: false,
};
