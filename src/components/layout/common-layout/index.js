import React from 'react';
import { Layout, BackTop } from 'antd';
import Header from '../header';
import Footer from '../footer';

import './index.scss';

const CommonLayout = (props) => (
    <Layout className="common-layout">
        <BackTop />
        <Header />
        <Layout.Content className="content">
            {props.children}
        </Layout.Content>
        <Footer />
    </Layout>
);

export default CommonLayout;