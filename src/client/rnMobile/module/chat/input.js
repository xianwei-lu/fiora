import React, { Component } from 'react';
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import pureRender from 'pure-render-decorator';

import color from '../../util/color';
import cs from '../../util/commonStyle';

let styles = null;

@pureRender
export default class Input extends Component {
    render() {
        return (
            <View style={styles.container()}>
                <TextInput style={styles.input()} />
                <TouchableOpacity
                    onPress={() => {}}
                >
                    <View style={styles.buttonContainer()}>
                        <Text style={styles.button()}>发送</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

styles = {
    container: () => ([
        cs.direction(),
        cs.size(undefined, 34),
    ]),
    input: () => ([
        cs.bgColor('white'),
        cs.flex(),
        cs.size(undefined, 30),
        cs.margin(0, 10, 0, 10),
        cs.radius(5),
        cs.padding(0, 5, 0, 5),
    ]),
    buttonContainer: () => ([
        cs.bgColor(color.lightBlue[6]),
        cs.size(60, 30),
        cs.center(),
        cs.margin(0, 10),
        cs.radius(5),
    ]),
    button: () => ([
        cs.font(16),
        cs.color('white'),
    ]),
};
