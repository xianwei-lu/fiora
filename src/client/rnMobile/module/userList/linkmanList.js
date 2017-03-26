import React, { Component, PropTypes } from 'react';
import {
    View,
    ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import pureRender from 'pure-render-decorator';

import cs from '../../util/commonStyle';
import Linkman from './linkman';

let styles = null;

@pureRender
class UserList extends Component {
    static propTypes = {
        linkmans: PropTypes.object.isRequired,
    }

    render() {
        const { linkmans } = this.props;
        return (
            <ScrollView>
                <View style={styles.container()}>
                    {
                        linkmans.map(linkman => (
                            <Linkman
                                key={linkman.get('type') + linkman.get('_id')}
                                linkman={linkman}
                            />
                        ))
                    }
                </View>
            </ScrollView>
        );
    }
}

styles = {
    container: () => ([
        cs.flex(),
        cs.layout('stretch'),
    ]),
};

export default connect(
    state => ({
        linkmans: state.getIn(['user', 'linkmans']),
    }),
)(UserList);
