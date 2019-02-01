import React, { Component } from 'react';
import { DatePicker, Button, Select } from 'antd';
import moment from 'moment';
import 'moment/locale/vi';

import CommonLayout from '../../layout/common-layout';
import ShoppingCartApi from '../../../api/shopping-cart.api';
import './index.scss';
import PageApi from '../../../api/page.api';

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment(),
      endDate: moment(),
      selectedPageId: '',
      loading: false,
      pages: [],
      pageId: null
    };

    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }

  async componentDidMount() {
    this.setState({ loading: true });

    const pagesRes = await PageApi.getPages();
    this.setState({
      loading: false,
      pages: pagesRes.data
    });
  }

  onChange(dates) {
    this.setState({
      startDate: dates[0],
      endDate: dates[1]
    });
  }

  onClick() {
    const { startDate, endDate, selectedPageId: pageId } = this.state;
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = ShoppingCartApi.getExportCsvUrl(pageId, startDate.toISOString(), endDate.toISOString());
    link.click();
  }

  onPageChange(value) {
    this.setState({ pageId: value });
  }

  render() {
    const presettedRanges = {
      "hôm nay": [
        moment().startOf("day"),
        moment().endOf("day")
      ],
      "tuần này": [
        moment().startOf("week"),
        moment().endOf("week")
      ],
      "tháng này": [
        moment().startOf("month"),
        moment().endOf("month")
      ]
    };

    const { loading, pages } = this.state;
    if (pages.filter(p => p.name === "Tất cả").length < 1) {
      pages.push({ pageId: null, name: 'Tất cả' });
    }
    const defaultPage = pages[0] && pages[0].pageId;

    return (
      <CommonLayout>
        <div className="download-order-list-form">
          <div>
            <DatePicker.RangePicker
              ranges={presettedRanges}
              defaultValue={presettedRanges["hôm nay"]}
              showTime
              format="DD/MM/YYYY HH:mm:ss"
              onChange={this.onChange}
              size="large"
            />
            <Select defaultValue={defaultPage} size="large" style={{ width: 120 }} onChange={this.onPageChange} loading={loading}>
              {
                pages.map(page => (
                  <Select.Option key={page.pageId} value={page.pageId}>
                    {page.name}
                  </Select.Option>
                ))
              }
            </Select>
          </div>
          <div>
            <Button onClick={this.onClick}
              icon="cloud-download"
              size="large">Tải xuống</Button>
          </div>
        </div>
      </CommonLayout>
    );
  }
}

export default Admin;