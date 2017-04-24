import React, { Component } from 'react';

import View from 'components/View';
import Form from 'features/Form';
import Avatar from 'components/Avatar';

export default class Login extends Component {
    render() {
        return (
            <View
                center fill
                backgroundImage={require('assets/images/background2.jpg')}
            >
                <View>
                    <Avatar />
                    <Form />
                </View>
            </View>
        );
    }
}
