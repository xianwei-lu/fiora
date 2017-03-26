import React, { Component, PropTypes } from 'react';
import {
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    AsyncStorage,
} from 'react-native';
import pureRender from 'pure-render-decorator';
import userDefaultAvatar from 'assets/images/user_avatar_default.png';

import color from '../../util/color';
import cs from '../../util/commonStyle';
import user from '../../../action/user';
import rn from '../../../action/rn';

let styles = null;

@pureRender
export default class Login extends Component {
    static propTypes = {
        status: PropTypes.string,
    }

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };
    }

    componentDidMount() {
        AsyncStorage.getItem('token', (err, token) => {
            if (token && token !== '') {
                user
                .reConnect(token)
                .then((result) => {
                    if (result.status === 201) {
                        user.online();
                        rn.navigator('userList');
                    }
                });
            }
        });
    }

    handleLogin = () => {
        user.login(
            this.state.username,
            this.state.password,
        ).then((response) => {
            if (response.status === 201) {
                AsyncStorage.setItem('token', response.data.token);
                user.online();
                rn.navigator('userList');
            }
        });
    }

    renderLogin = () => (
        <View style={styles.container()}>
            <Image
                style={styles.avatar()}
                source={userDefaultAvatar}
            />
            <View style={styles.textInputContainer()}>
                <TextInput
                    style={styles.textInput()}
                    onChangeText={text => this.setState({ username: text })}
                    autoCorrect={false}
                    autoCapitalize="none"
                    autoFocus
                    maxLength={16}
                    placeholder="请输入用户名"
                />
            </View>
            <View style={[styles.textInputContainer(true)]}>
                <TextInput
                    style={styles.textInput()}
                    onChangeText={text => this.setState({ password: text })}
                    secureTextEntry
                    placeholder="请输入密码"
                />
            </View>
            <TouchableOpacity
                style={styles.buttonContainer()}
                onPress={this.handleLogin}
            >
                <Text style={styles.button()}>登录</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.textContainer()}
                onPress={() => rn.navigator('login', { status: 'signup' })}
            >
                <Text
                    style={styles.text()}
                >新司机注册</Text>
            </TouchableOpacity>
        </View>
    )

    renderSignup = () => (
        <View style={styles.container()}>
            <Image
                style={styles.avatar()}
                source={userDefaultAvatar}
            />
            <View style={styles.textInputContainer()}>
                <TextInput
                    style={styles.textInput()}
                    autoCorrect={false}
                    autoCapitalize="none"
                    autoFocus
                    maxLength={16}
                    placeholder="请输入用户名(即昵称)"
                />
            </View>
            <View style={[styles.textInputContainer(true)]}>
                <TextInput
                    style={styles.textInput()}
                    secureTextEntry
                    placeholder="请输入密码"
                />
            </View>
            <TouchableOpacity
                style={styles.buttonContainer()}
            >
                <Text style={styles.button()}>注册</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.textContainer()}
                onPress={() => rn.navigator('login', { status: 'login' })}
            >
                <Text
                    style={styles.text()}
                >老司机登录</Text>
            </TouchableOpacity>
        </View>
    )

    render() {
        return !this.props.status || this.props.status === 'login' ? this.renderLogin() : this.renderSignup();
    }
}

styles = {
    container: () => ([
        cs.layout('center'),
        cs.flex(),
        cs.bgColor(color.gery[1]),
        cs.position('relative'),
    ]),
    avatar: () => ([
        cs.size(80, 80),
        cs.margin(50, undefined, 5, undefined),
        cs.radius(40),
    ]),
    textInputContainer: noTopBorder => ([
        cs.layout('stretch'),
        cs.border(`${noTopBorder ? '' : 'Top'} Bottom`, 1, color.gery[1]),
        cs.bgColor('white'),
        cs.size(undefined, 50),
        cs.alignSelf(),
    ]),
    textInput: () => ([
        cs.size(undefined, 50),
        cs.textAlign(),
        cs.font(18),
        cs.color(color.gery[8]),
    ]),
    buttonContainer: () => ([
        cs.bgColor(color.lightBlue[4]),
        cs.center(),
        cs.alignSelf(),
        cs.size(undefined, 40),
        cs.margin(10, 10, undefined, 10),
        cs.radius(3),
    ]),
    button: () => ([
        cs.color('white'),
        cs.font(18, undefined, 'bold'),
    ]),
    textContainer: () => ([
        cs.center(),
        cs.size(100, 50),
        cs.position('absolute', undefined, 0, 0, undefined),
    ]),
    text: () => ([
        cs.color(color.lightBlue[4]),
    ]),
};
