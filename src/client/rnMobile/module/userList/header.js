import React, { Component, PropTypes } from 'react';
import {
    Text,
    View,
    Image,
} from 'react-native';
import { connect } from 'react-redux';
import pureRender from 'pure-render-decorator';

import color from '../../util/color';
import url from '../../util/url';
import cs from '../../util/commonStyle';

let styles = null;

@pureRender
class Header extends Component {
    static propTypes = {
        username: PropTypes.string.isRequired,
        avatar: PropTypes.string.isRequired,
        online: PropTypes.bool.isRequired,
    }

    render() {
        const { username, avatar, online } = this.props;
        return (
            <View style={styles.container()}>
                <Image
                    style={styles.avatar()}
                    source={{ uri: `${url(avatar)}?imageView2/2/w/34/h/34` }}
                />
                <View style={styles.online(online)} />
                <Text style={styles.nick()}>{username}</Text>
            </View>
        );
    }
}

styles = {
    container: () => ([
        cs.size(undefined, 60),
        cs.bgColor(color.lightBlue[5]),
        cs.padding(20),
        cs.direction(),
        cs.center(),
    ]),
    avatar: () => ([
        cs.size(34, 34),
        cs.radius(17),
        cs.position('absolute', undefined, undefined, 3, 10),
    ]),
    online: isOnline => ([
        cs.size(6, 6),
        cs.radius(3),
        cs.bgColor(isOnline ? '#7cfc00' : 'red'),
        cs.position('absolute', undefined, undefined, 17, 52),
    ]),
    nick: () => ([
        cs.font(16),
        cs.color(color.gery[1]),
    ]),
};

export default connect(
    state => ({
        username: state.getIn(['user', 'username']),
        avatar: state.getIn(['user', 'avatar']),
        online: state.getIn(['user', 'online']),
    }),
)(Header);
