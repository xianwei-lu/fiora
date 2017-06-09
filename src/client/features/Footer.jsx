import React, { Component } from 'react';
import { Layout } from 'antd';

import 'styles/feature/footer.less';

export default class Footer extends Component {
    render() {
        return (
            <Layout.Footer className="feature-footer">
                <div>github/fiora ©2016 author yinxin630</div>
            </Layout.Footer>
        );
    }
}
