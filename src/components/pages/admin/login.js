import React, { Component } from 'react';
import { Form, Icon, Input, Button, message } from 'antd';
import CommonLayout from '../../layout/common-layout';
import AuthenApi from '../../../api/authen.api';
import UserInfoService from '../../../services/user-info.service';
import './index.scss';

const FormItem = Form.Item;

class NormalLoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = { submitting: false };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (err) return;

      this.setState({ submitting: true });
      const res = await AuthenApi.login(values.username, values.password);
      this.setState({ submitting: false });

      if (res.success) {
        UserInfoService.setUser(res.data);
        message.success('Đăng nhập thành công!');
      } else {
        message.error(res.error ? res.error : 'Đăng nhập thất bại! Vui lòng thử lại.');
      }
    });
  }

  render() {
    const { submitting } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <CommonLayout>
        <Form onSubmit={this.handleSubmit} className='login-form'>
          <FormItem>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: 'Please input your username!' }],
            })(
              <Input disabled={submitting} size='large' prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder='Username' />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input disabled={submitting} size='large' prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />} type='password' placeholder='Password' />
            )}
          </FormItem>
          <FormItem>
            <Button loading={submitting} size='large' type='primary' htmlType='submit' className='login-form-button'>
              Log in
          </Button>
          </FormItem>
        </Form>
      </CommonLayout>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);
export default WrappedNormalLoginForm;