import React, { Component } from 'react';
import { Layout } from 'antd';
import pureRender from 'pure-render-decorator';

import 'styles/feature/footer.less';

@pureRender
export default class Footer extends Component {
    render() {
        return (
            <Layout.Footer className="feature-footer">
                <div>github/fiora ©2016 author yinxin630</div>
            </Layout.Footer>
        );
    }
}
