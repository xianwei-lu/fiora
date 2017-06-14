import React, { Component } from 'react';
import { Layout, Button } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';

import Avatar from 'components/Avatar';
import TextButton from 'components/TextButton';
import Icon from 'components/Icon';

import 'styles/feature/header.less';

@pureRender
class Header extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired,
    }
    static propTypes = {
        id: PropTypes.string,
        avatar: PropTypes.string,
    }
    jumpTo = (path) => {
        this.context.router.history.push(path);
    }
    render() {
        const { id, avatar } = this.props;
        return (
            <Layout.Header className="feature-header">
                {
                    id ?
                        <div className="wrap">
                            <div className="button-group">
                                <Button type="primary" shape="circle" size="large">
                                    <Icon icon="icon-create-group-chat" size={22} />
                                </Button>
                            </div>
                            <Avatar className="avatar" width={32} height={32} src={avatar} circular />
                        </div>
                    :
                        <div className="wrap">
                            <TextButton text="注册" onClick={this.jumpTo.bind(this, '/signin')} />
                            <TextButton text="登录" onClick={this.jumpTo.bind(this, '/login')} />
                        </div>
                }
            </Layout.Header>
        );
    }
}

export default connect(
    state => ({
        id: state.getIn(['user', '_id']),
        avatar: state.getIn(['user', 'avatar']),
    }),
)(Header);
