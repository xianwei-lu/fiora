import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Motion, spring } from 'react-motion';
import pureRender from 'pure-render-decorator';

import './systemSetting.scss';

import ui from '../../action/pc';
import user from '../../action/user';

@pureRender
class SystemSetting extends React.Component {
    static propTypes = {
        show: PropTypes.bool.isRequired,
        desktopNotification: PropTypes.bool,
        soundNotification: PropTypes.bool,
    };

    static contextTypes = {
        router: React.PropTypes.object.isRequired,
    }

    static handleCloseClick() {
        ui.closeSystemSetting();
        ui.closeMaskLayout();
    }

    handleLogoutClick = () => {
        user.logout().then((response) => {
            if (response.status === 204) {
                this.context.router.push('/login');
                window.localStorage.removeItem('token');
                user.init();
            }
        });
    }

    handleDesktopSwitch = () => {
        const { desktopNotification } = this.props;
        if (desktopNotification) {
            ui.closeDesktopNotification();
        } else {
            ui.openDesktopNotification();
        }
        window.localStorage.setItem('desktopNotification', !desktopNotification);
    }

    handleSoundSwitch = () => {
        const { soundNotification } = this.props;
        if (soundNotification) {
            ui.closeSoundNotification();
        } else {
            ui.openSoundNotification();
        }
        window.localStorage.setItem('soundNotification', !soundNotification);
    }

    render() {
        const { show, desktopNotification, soundNotification } = this.props;

        return (
            <Motion
                defaultStyle={{ scale: 0.4, opacity: 0 }}
                style={{ scale: spring(show ? 1 : 0.4), opacity: spring(show ? 1 : 0) }}
            >
                {
                ({ scale, opacity }) => (
                    <div
                        className="system-setting"
                        style={{ opacity, transform: `scale(${scale})`, display: opacity === 0 ? 'none' : 'flex' }}
                    >
                        <div>
                            <span>系统设置</span>
                            <i
                                className="icon"
                                onClick={this.handleCloseClick}
                            >&#xe603;</i>
                        </div>
                        <div>
                            <div className="switch">
                                <span>启用桌面通知</span>
                                <div
                                    onClick={this.handleDesktopSwitch}
                                >
                                    <div
                                        className={desktopNotification ? 'on' : 'off'}
                                    />
                                </div>
                            </div>
                            <div className="switch">
                                <span>启用声音通知</span>
                                <div
                                    onClick={this.handleSoundSwitch}
                                >
                                    <div
                                        className={soundNotification ? 'on' : 'off'}
                                    />
                                </div>
                            </div>
                            <a
                                className="button"
                                href="https://github.com/yinxin630/fiora"
                                target="_blank" // eslint-disable-line
                            >
                                <i className="icon">&#xe611;</i>
                                <span>源码</span>
                            </a>
                            <a
                                className="button"
                                href="http://suisuijiang.com"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                <i className="icon">&#xe612;</i>
                                <span>作者</span>
                            </a>
                            <a
                                className="button"
                                onClick={this.handleLogoutClick}
                            >
                                <i className="icon">&#xe614;</i>
                                <span>登出</span>
                            </a>
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
        show: state.getIn(['pc', 'showSystemSetting']),
        desktopNotification: state.getIn(['pc', 'desktopNotification']),
        soundNotification: state.getIn(['pc', 'soundNotification']),
    }),
)(SystemSetting);
