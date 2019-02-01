import React, { Component } from 'react';
import { Modal, Input, message } from 'antd';
import DeliveryInfo from '../../../models/delivery-info';

class DeliveryInfoForm extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = { submitting: false };
    }

    onChange(e) {
        const { name, value } = e.target;
        this.props.onChange(name, value);
    }

    async onSubmit(e) {
        e.preventDefault();

        // validating  
        const deliveryInfo = this.props.deliveryInfo;
        const validateError = DeliveryInfo.validate(deliveryInfo);
        if (validateError) {
            message.error(validateError);
            return;
        }

        this.setState({ submitting: true });
        await this.props.onSubmit();
        this.setState({ submitting: false })
    }

    render() {
        const {
            isVisible,
            deliveryInfo,
            onClose
        } = this.props;

        const fieldNames = DeliveryInfo.getFieldNames();

        return (
            <Modal className="delivery-info-form"
                title="Hoàn tất đơn hàng"
                visible={isVisible}
                confirmLoading={this.state.submitting}
                centered
                okText="Hoàn tất"
                cancelText="Hủy"
                okButtonProps={{
                    size: "large",
                    icon: "check"
                }}
                cancelButtonProps={{
                    size: "large",
                    icon: "close-circle",
                    onClick: onClose
                }}
                onOk={() => document.getElementById("submit-form").click()}
                onCancel={onClose}
                destroyOnClose
            >
                <form onSubmit={this.onSubmit}>
                    {
                        fieldNames.map(fieldName =>
                            <Input key={fieldName}
                                required
                                placeholder={DeliveryInfo.getPlaceHolder(fieldName)}
                                name={fieldName}
                                value={deliveryInfo[fieldName]}
                                onChange={this.onChange} />
                        )
                    }
                    <input id="submit-form" type="submit" style={{ display: "none" }} />
                </form>
            </Modal>
        );
    }
}

export default DeliveryInfoForm;