import React, { Component } from 'react';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import { Card, Tabs } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Animate from 'rc-animate';

import 'styles/feature/selectExpression.less';

import expressions from '../../utils/expressions';
import action from '../state/action';

const { TabPane } = Tabs;

@immutableRenderDecorator
class SelectExpression extends Component {
    static propTypes = {
        showSelectExpression: PropTypes.bool.isRequired,
    }
    constructor(...args) {
        super(...args);
        this.close = action.setSelectExpression.bind(null, false);
    }
    renderDefaultExpression = () => (
        <div className="default-expression">
            {
                expressions.default.map((e, index) => (
                    <div
                        key={index}
                    >
                        <div style={{ backgroundPosition: `left ${-30 * index}px`, backgroundImage: `url(${require('assets/images/expressions.png')})` }} />
                    </div>
                ))
            }
        </div>
    )
    render() {
        const { showSelectExpression } = this.props;
        const extra = (
            <button className="close-button ant-modal-close" onClick={this.close}>
                <span className="ant-modal-close-x" />
            </button>
        );
        return (
            <Animate
                transitionName="fade"
                transitionAppear
            >
                {
                    showSelectExpression ?
                        <div className="feature-select-expression" key="a">
                            <div>
                                <h3>选择表情</h3>
                                {extra}
                            </div>
                            <Tabs type="line" tabPosition="left">
                                <TabPane tab="默认表情" key="1">
                                    { this.renderDefaultExpression() }
                                </TabPane>
                                <TabPane tab="我的收藏" key="2">
                                    <p>暂未支持</p>
                                </TabPane>
                            </Tabs>
                        </div>
                    :
                        null
                }
            </Animate>
        );
    }
}

export default connect(
    ($$state) => ({
        showSelectExpression: $$state.getIn(['view', 'showSelectExpression']),
    }),
)(SelectExpression);
