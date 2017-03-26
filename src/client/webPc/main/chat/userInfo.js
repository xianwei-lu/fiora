import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Motion, spring } from 'react-motion';
import pureRender from 'pure-render-decorator';

import './userInfo.scss';

import ui from '../../../action/pc';
import user from '../../../action/user';
import Avatar from '../../../common/avatar';

const initialState = {
    avatar: '',
    username: '',
    gender: 'male',
    birthday: new Date(),
    location: '',
    website: '',
    github: '',
    qq: '',
};

@pureRender
class UserInfo extends React.Component {
    static propTypes = {
        show: PropTypes.bool.isRequired,
        userId: PropTypes.string.isRequired,
    };

    static contextTypes = {
        router: React.PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = initialState;
    }

    componentWillUpdate(nextProps) {
        if (this.props.show !== nextProps.show && nextProps.show) {
            this.setState(initialState);
            user.getUserInfo(nextProps.userId).then((response) => {
                if (response.status) {
                    this.setState({
                        _id: nextProps.userId,
                        ...response.data,
                    });
                }
            });
        }
    }

    handleCloseClick = () => {
        ui.closeUserInfo();
        ui.closeMaskLayout();
    }

    handleSendMessageClick = () => {
        user.addUserLinkman(this.state);
        ui.closeUserInfo();
        ui.closeMaskLayout();
        this.context.router.push(`/main/chat/stranger/${this.props.userId}`);
    }

    render() {
        const { show } = this.props;
        const { avatar, username } = this.state;
        const otherInfos = [
            { key: 'github', value: this.state.github, icon: '&#xe61b;' },
            { key: 'website', value: this.state.website, icon: '&#xe617;' },
            { key: 'qq', value: this.state.qq ? `tencent://message/?uin=${this.state.qq}` : undefined, icon: '&#xe61a;' },
        ];
        const location = this.state.location || '火星';
        let createdDays = (Date.now() - new Date(this.state.createTime).getTime()) / (1000 * 60 * 60 * 24);
        if (createdDays > 365) {
            createdDays = `${parseInt(createdDays / 365, 10)}年`;
        } else {
            createdDays = `${parseInt(createdDays, 10)}天`;
        }

        return (
            <Motion
                defaultStyle={{ scale: 0.4, opacity: 0 }}
                style={{ scale: spring(show ? 1 : 0.4), opacity: spring(show ? 1 : 0) }}
            >
                {
                ({ scale, opacity }) => (
                    <div
                        className="user-info"
                        style={{ opacity, transform: `scale(${scale})`, display: opacity === 0 ? 'none' : 'flex' }}
                    >
                        <div>
                            <i
                                className="icon"
                                onClick={this.handleCloseClick}
                            >&#xe603;</i>
                            <div
                                className="background-image"
                                style={{ backgroundImage: `url('${/^http/.test(avatar) ? `${avatar}?imageView2/2/h/300/w/300/format/jpg` : require('assets/images/user_avatar_default.png')}')` }}
                            />
                            <div className="background-mask" />
                            <div className="content">
                                <Avatar
                                    width={80}
                                    height={80}
                                    avatar={avatar}
                                    name={username}
                                />
                                <span>{this.state.username}</span>
                                <div className="icon-list">
                                    {
                                        otherInfos.map((o, index) => (
                                            o.value ?
                                                <a
                                                    key={index}
                                                    className="icon"
                                                    title={o.key}
                                                    href={o.value}
                                                    rel="noopener noreferrer"
                                                    target="_blank"
                                                    dangerouslySetInnerHTML={{ __html: o.icon }}
                                                    style={o.key === 'website' ? { position: 'relative', top: 3 } : {}}
                                                />
                                            : null
                                        ))
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="normal-status">
                            <div>
                                <div>
                                    <div>
                                        <span>性别:</span>
                                        <span>年龄:</span>
                                        <span>时长:</span>
                                        <span>位置:</span>
                                    </div>
                                    <div>
                                        <span>{this.state.gender === 'male' ? '男' : '女'}</span>
                                        <span>{(1 + new Date().getFullYear()) - new Date(this.state.birthday).getFullYear()}</span>
                                        <span>{createdDays}</span>
                                        <span>{location}</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button
                                    onClick={this.handleSendMessageClick}
                                >发起聊天</button>
                            </div>
                        </div>
                    </div>
                )
            }
            </Motion>
        );
    }
}

export default connect(
    state => ({
        show: state.getIn(['pc', 'showUserInfo']),
        userId: state.getIn(['pc', 'userInfoId']),
    }),
)(UserInfo);
