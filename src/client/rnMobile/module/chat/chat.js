import React, { Component } from 'react';
import {
    Text,
    View,
} from 'react-native';
import pureRender from 'pure-render-decorator';

import color from '../../util/color';
import cs from '../../util/commonStyle';

import MessageList from './messageList';
import Input from './input';

let styles = null;

@pureRender
export default class Chat extends Component {
    render() {
        return (
            <View style={styles.container()}>
                <View style={styles.header()}>
                    <Text style={styles.headerNick()}>fiora</Text>
                </View>
                <MessageList />
                <Input />
            </View>
        );
    }
}

styles = {
    container: () => ([
        cs.flex(),
        cs.bgColor(color.gery[3]),
    ]),
    header: () => ([
        cs.size(undefined, 60),
        cs.bgColor(color.lightBlue[5]),
        cs.padding(20),
        cs.center(),
    ]),
    headerNick: () => ([
        cs.font(18, undefined, 'bold'),
        cs.color(color.gery[1]),
    ]),
};
