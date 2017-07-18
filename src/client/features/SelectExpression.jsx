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
    handleClick = (e) => {
        const name = e.currentTarget.dataset.name;
        action.insertInputValue(`#(${name})`);
        this.close();
    }
    renderDefaultExpression = () => (
        <div className="default-expression">
            {
                expressions.default.map((e, index) => (
                    <div
                        key={index}
                        data-name={e}
                        onClick={this.handleClick}
                    >
                        <div style={{ backgroundPosition: `left ${-30 * index}px`, backgroundImage: `url(${require('assets/images/expressions.png')})` }} />
                    </div>
                ))
            }
        </div>
    )
    renderShortcut = () => (
        <div className="shortcut">
            {
                expressions.shortcut.keys.map((e, index) => (
                    <div key={index}>
                        <div style={{ backgroundPosition: `left ${-30 * expressions.default.indexOf(e)}px`, backgroundImage: `url(${require('assets/images/expressions.png')})` }} />
                        <h4>{expressions.shortcut.funcKey} + {index}</h4>
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
                transitionName="select-expression"
                transitionAppear
            >
                {
                    showSelectExpression ?
                        <Card className="feature-select-expression" title="选择表情" extra={extra} key="a">
                            <Tabs type="line" tabPosition="left">
                                <TabPane tab="默认表情" key="1">
                                    { this.renderDefaultExpression() }
                                </TabPane>
                                <TabPane tab="我的收藏" key="2">
                                    <h3>暂未实现该功能</h3>
                                </TabPane>
                                <TabPane tab="快捷键" key="3">
                                    <h3>点击输入框, 按下快捷键, 快速输入相应表情</h3>
                                    { this.renderShortcut() }
                                </TabPane>
                            </Tabs>
                        </Card>
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
