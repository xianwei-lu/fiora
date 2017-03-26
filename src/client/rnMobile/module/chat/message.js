import React, { Component, PropTypes } from 'react';
import {
    Text,
    View,
    Image,
} from 'react-native';
import pureRender from 'pure-render-decorator';

import color from '../../util/color';
import cs from '../../util/commonStyle';

let styles = null;

@pureRender
export default class Message extends Component {
    static propTypes = {
        isSelf: PropTypes.bool,
    }

    render() {
        const { isSelf } = this.props;

        return (
            <View style={styles.container(isSelf)}>
                <Image
                    style={styles.avatar()}
                    source={{ uri: 'https://ogbhsgzz2.qnssl.com/user_avatar_default.png' }}
                />
                <View style={styles.message(isSelf)}>
                    <View style={styles.nickTimeContainer(isSelf)}>
                        <Text style={styles.nick()}>碎碎酱的小跟班</Text>
                        <Text style={styles.time()}>11:11</Text>
                    </View>
                    <View style={styles.contentContainer()}>
                        <Text style={styles.content()}>我是一只死辣鸡, 死啊死辣鸡.我是一只死辣鸡, 死啊死辣鸡.我是一只死辣鸡, 死啊死辣鸡.我是一只死辣鸡, 死啊死辣鸡.我是一只死辣鸡, 死啊死辣鸡.</Text>
                    </View>
                </View>
            </View>
        );
    }
}

styles = {
    container: isSelf => ([
        cs.direction(isSelf ? 'row-reverse' : 'row'),
        cs.margin(0, 0, 5),
    ]),
    avatar: () => ([
        cs.size(40, 40),
        cs.radius(20),
        cs.margin(3, 10, 3, 10),
    ]),
    message: isSelf => ([
        cs.flex(),
        isSelf ? cs.margin(0, 0, 0, 60) : cs.margin(0, 60),
        cs.padding(3),
    ]),
    nickTimeContainer: isSelf => ([
        cs.direction(),
        cs.layout('flex-end'),
        isSelf ? cs.layout('flex-end', 'flex-end') : {},
    ]),
    nick: () => ([
        cs.padding(0, 0, 0, 2),
        cs.color(color.gery[9]),
    ]),
    time: () => ([
        cs.margin(0, 0, 0, 10),
        cs.font(12),
        cs.color(color.gery[6]),
    ]),
    contentContainer: () => ([
        cs.bgColor('white'),
        cs.border('all', 1, color.gery[5]),
        cs.radius(5),
        cs.padding(5, 10, 5, 10),
        cs.margin(3),
    ]),
    content: () => ([

    ]),
};
