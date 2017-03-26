import React, { Component, PropTypes } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import pureRender from 'pure-render-decorator';

import color from '../../util/color';
import url from '../../util/url';
import cs from '../../util/commonStyle';
import rn from '../../../action/rn';

let styles = null;

@pureRender
export default class Linkman extends Component {
    static propTypes = {
        linkman: PropTypes.object.isRequired,
    }

    handleClick = () => {
        const { linkman } = this.props;
        rn.navigator('chat', { linkmanType: linkman.get('type'), linkmanId: linkman.get('_id') });
    }

    render() {
        const { linkman } = this.props;

        const isGroup = linkman.get('type') === 'group';
        const messagesLength = linkman.get('messages').size;
        const time = moment(messagesLength === 0 ? linkman.get('createTime') : linkman.getIn(['messages', messagesLength - 1, 'createTime'])).format('HH:mm');
        const message = messagesLength === 0 ? null : linkman.getIn(['messages', messagesLength - 1]);
        let content = '...';
        if (message) {
            content = message.get('preview');
        }

        return (
            <TouchableOpacity
                onPress={this.handleClick}
            >
                <View style={styles.container()}>
                    <Image
                        style={styles.avatar()}
                        source={{ uri: url(linkman.get('avatar')) }}
                    />
                    <View style={styles.content()}>
                        <View style={styles.nickTimeContainer()}>
                            <Text style={styles.nick()}>{isGroup ? linkman.get('name') : linkman.get('username')}</Text>
                            <Text style={styles.time()}>{time}</Text>
                        </View>
                        <Text style={styles.preview()}>{content}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

styles = {
    container: () => ([
        cs.size(undefined, 70),
        cs.layout('center'),
        cs.direction(),
    ]),
    avatar: () => ([
        cs.size(50, 50),
        cs.radius(25),
        cs.margin(0, 10, 0, 10),
    ]),
    content: () => ([
        cs.flex(),
        cs.alignSelf(),
        cs.border('Bottom', 1, color.gery[2]),
        cs.layout('stretch', 'center'),
        cs.padding(0, 10),
    ]),
    nickTimeContainer: () => ([
        cs.direction(),
        cs.layout('flex-end', 'space-between'),
    ]),
    nick: () => ([
        cs.font(18),
    ]),
    time: () => ([
        cs.font(12),
        cs.color(color.gery[6]),
    ]),
    preview: () => ([
        cs.color(color.gery[7]),
        cs.margin(3),
    ]),
};
