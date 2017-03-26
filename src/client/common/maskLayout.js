import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import pureRender from 'pure-render-decorator';

import './maskLayout.scss';

@pureRender
class MaskLayout extends React.Component {
    static propTypes = {
        show: PropTypes.bool.isRequired,
    };

    render() {
        return (
            <div
                className="mask-layout"
                id="maskLayout"
                style={{ display: this.props.show ? 'block' : 'none' }}
            />
        );
    }
}

export default connect(
    state => ({
        show: state.getIn(['pc', 'showMaskLayout']),
    }),
)(MaskLayout);
