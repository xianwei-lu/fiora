import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { Modal, Input, Button, message } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';

import Avatar from 'components/Avatar';

import 'styles/feature/searchGroup.less';

import action from '../state/action';

@pureRender
class SearchGroup extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired,
    }
    static propTypes = {
        visible: PropTypes.bool.isRequired,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            loading: false,
            searchResult: null,
        };
        this.closeModal = action.setShowSearchGroup.bind(null, false);
    }
    handleOk = () => {
        this.setState({ loading: true });
        action.searchGroup(ReactDom.findDOMNode(this.searchGroupInput).value).then((res) => {
            this.setState({ searchResult: res.data, loading: false });
        });
    }
    handleJoinGroup = (id) => {
        action.joinGroup(id).then((res) => {
            if (res.status === 201) {
                this.closeModal();
                message.success('加入群组成功');
                this.context.router.history.push(`/group/${res.data.name}`);
            } else {
                message.error(res.data);
            }
        });
    }
    render() {
        const { visible } = this.props;
        const { loading, searchResult } = this.state;
        return (
            <Modal
                visible={visible}
                title="搜索群组"
                okText="搜索"
                onOk={this.handleOk}
                onCancel={this.closeModal}
                confirmLoading={loading}
                className="feature-search-group"
            >
                <Input placeholder="请输入群组名" ref={(i) => this.searchGroupInput = i} />
                {
                    searchResult ?
                        <div className="group-list">
                            <div className="header">
                                <h4>搜索结果</h4>
                            </div>
                            <div className="body">
                                {
                                    searchResult.map((group) => (
                                        <div key={group._id}>
                                            <div>
                                                <Avatar width={40} height={40} circular src={group.avatar} />
                                                <div className="content">
                                                    <p>{group.name}</p>
                                                    <p>人数: {group.members}</p>
                                                </div>
                                                <div className="hover">
                                                    <Button type="primary" onClick={this.handleJoinGroup.bind(this, group._id)}>加入群组</Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    :
                        null
                }
            </Modal>
        );
    }
}

export default connect(
    ($$state) => ({
        visible: $$state.getIn(['view', 'showSearchGroup']),
    }),
)(SearchGroup);
