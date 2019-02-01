import React, { Component } from 'react';
import { Layout } from 'antd';
import './index.scss';

class Header extends Component {
    render() {
        return (
            <Layout.Header>
                {this.props.content}
            </Layout.Header>
        );
    }
}

export default Header;

