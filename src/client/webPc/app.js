import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import 'assets/styles/monokai-sublime.min.css';
import backImage from 'assets/images/background.jpg';

import './app.scss';

import user from '../action/user';
import ui from '../action/pc';
import socket from '../socket';
import publicApi from '../api';
import messageTool from '../util/message';

import Notification from '../common/notification';
import MaskLayout from '../common/maskLayout';
import ImageViewer from '../common/imageViewer';

window.fiora = publicApi;

class App extends React.Component {
    static propTypes = {
        children: PropTypes.element,
        location: PropTypes.object.isRequired,
        playSound: PropTypes.bool,
    };

    static contextTypes = {
        router: React.PropTypes.object.isRequired,
    }


    componentWillMount() {
        // force to root path
        this.context.router.push('/');

        // system setting
        if (window.localStorage.getItem('desktopNotification') === 'false') {
            ui.closeDesktopNotification();
        } else {
            ui.openDesktopNotification();
        }
        if (window.localStorage.getItem('soundNotification') === 'false') {
            ui.closeSoundNotification();
        } else {
            ui.openSoundNotification();
        }

        // try auto login
        const token = window.localStorage.getItem('token');
        if (token && token !== '') {
            user
            .reConnect(token)
            .then((result) => {
                if (result.status === 201) {
                    user.online();
                    if (this.props.location.pathname === '/') {
                        this.context.router.push('/main');
                    }
                }
            });
        }

        // register server event
        socket.on('groupMessage', (data) => {
            data.linkmanType = 'group';
            messageTool.messageHandle(data);
        });

        socket.on('message', (data) => {
            data.linkmanType = 'stranger';
            messageTool.messageHandle(data);
        });

        socket.on('disconnect', () => {
            user.offline();
        });
        socket.on('reconnect', () => {
            user
            .reConnect()
            .then((result) => {
                if (result.status === 201) {
                    user.online();
                }
            });
        });

        // html5 notification
        if (window.Notification && (window.Notification.permission === 'default' || window.Notification.permission === 'denied')) {
            window.Notification.requestPermission();
        }
    }

    componentDidMount() {
        window.onfocus = () => ui.windowFocus(true);
        window.onblur = () => ui.windowFocus(false);
    }

    componentWillUpdate(nextProps) {
        if (nextProps.playSound && this.props.playSound !== nextProps.playSound) {
            this.sound.play();
            ui.playSound(false);
        }
    }

    render() {
        // for debug
        // console.log(this.props.state.toJS());
        const width = window.screen.width;
        const height = window.screen.height;

        return (
            <div className="window">
                <div
                    className="background"
                    style={{ backgroundSize: `${width}px ${height - 50}px`, backgroundImage: `url(${backImage})` }}
                >
                    {
                    /^\/main/.test(this.props.location.pathname) ?
                        <div style={{ backgroundSize: `${width}px ${height - 50}px`, backgroundImage: `url(${backImage})` }} />
                    :
                        null
                }
                </div>
                <Notification />
                <MaskLayout />
                <ImageViewer />
                <audio
                    ref={sound => this.sound = sound}
                >
                    <source src={require('assets/sounds/message_sound.mp3')} type="audio/mp3" />
                    <source src={require('assets/sounds/message_sound.ogg')} type="audio/ogg" />
                    <source src={require('assets/sounds/message_sound.wav')} type="audio/wav" />
                </audio>
                { this.props.children }
            </div>
        );
    }
}

export default connect(
    state => ({
        state,
        playSound: state.getIn(['pc', 'playSound']),
    }),
)(App);
