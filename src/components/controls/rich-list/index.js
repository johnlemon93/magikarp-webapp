import React, { Component } from 'react';
import { List, Button } from 'antd';

import './index.scss';

class RichList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initLoading: true,
            loading: false,
            data: [],
            list: [],
            isShowLoadMore: false
        };
        this.onLoadMore = this.onLoadMore.bind(this);
    }

    componentDidMount() {
        this.getDataAndSetState();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.dataUrl !== this.props.dataUrl) {
            this.getDataAndSetState();
        }
    }

    async getDataAndSetState() {
        const api = this.props.api;
        if (!api) return;
        this.setState({
            loading: true
        });
        const res = await api.get(this.props.dataUrl);
        // TODO: it would only return the data array
        const result = res.data;
        this.setState({
            initLoading: false,
            loading: false,
            // TODO: it would only return the data array
            data: result && result.success ? result.data.promotions : [],
            list: result && result.success ? result.data.promotions : [],
            isShowLoadMore: result && result.success ? result.data.isShowLoadMore : false,
            currentPage: result && result.success ? result.data.currentPage : 1
        });
    }

    async onLoadMore() {
        this.setState({
            loading: true
        });
        const { currentPage } = this.state;
        const api = this.props.api;
        const res = await api.get(`${this.props.dataUrl}&page=${currentPage + 1}`);
        const result = res.data;
        const data = this.state.data.concat(result && result.success ? result.data.promotions : []);

        this.setState({
            data,
            list: data,
            loading: !result.data,
            isShowLoadMore: result && result.success ? result.data.isShowLoadMore : false,
            currentPage: result && result.success ? result.data.currentPage : 1
        });
    }

    render() {
        const { initLoading, loading, list, isShowLoadMore } = this.state;
        const loadMore = !initLoading && !loading && isShowLoadMore ? (
            <div className="load-more-btn">
                <Button onClick={this.onLoadMore} icon="ellipsis" />
            </div>
        ) : null;

        let { header, renderItem, dataSource, column } = this.props;
        dataSource = dataSource || list;
        column = column || dataSource.length / 2;

        return (
            <List
                header={header}
                grid={{ gutter: 16, column: column }}
                dataSource={dataSource}
                renderItem={renderItem}
                loading={loading || this.props.loading}
                loadMore={loadMore}
            />
        );
    }
}

export default RichList;