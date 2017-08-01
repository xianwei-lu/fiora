import React from 'react';
import { Layout } from 'antd';
import 'styles/feature/footer.less';

export default function Footer() {
    return (
        <Layout.Footer className="feature-footer">
            <div>©2015 - {new Date().getFullYear()} &nbsp; 作者: <a href="https://suisuijiang.com/" target="_blank" rel="noopener noreferrer">碎碎酱</a> &nbsp; 源码: <a href="https://github.com/yinxin630" target="_blank" rel="noopener noreferrer">github/fiora</a></div>
        </Layout.Footer>
    );
}
