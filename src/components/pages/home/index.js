import React, { Component } from 'react';
import { Card, Button, Modal, message } from 'antd';
import ProductLayout from '../../layout/product-layout';
import ProductCard from '../../controls/product-card';
import RichList from '../../controls/rich-list';
import DeliveryInfoForm from './delivery-info-form';

import ProductApi from '../../../api/product.api';
import ShoppingCartApi from '../../../api/shopping-cart.api';

import DeliveryInfo from '../../../models/delivery-info';
import CartItem from '../../../models/cart-item';

import './index.scss';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            products: [],
            priceSteps: [],
            productCartItems: {},
            shippingCost: 0,
            isDeliveryInfoFormVisible: false,
            deliveryInfo: new DeliveryInfo()
        };

        this.handleProductCartItemChange = this.handleProductCartItemChange.bind(this);
        this.handleDone = this.handleDone.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleOpenUserForm = this.handleOpenUserForm.bind(this);
        this.handleCloseUserForm = this.handleCloseUserForm.bind(this);
        this.handleDeliveryInfoChange = this.handleDeliveryInfoChange.bind(this);

        // config antd toast
        message.config({ top: 200 });
    }

    async componentDidMount() {
        this.setState({ loading: true });
        const { pageId } = this.props.match.params;

        const [products, priceSteps, shippingCost] = await Promise.all([
            ProductApi.getProducts(pageId),
            ProductApi.getPriceSteps(pageId),
            ProductApi.getShippingCost(pageId)
        ]);

        this.setState({
            loading: false,
            products: products.data,
            priceSteps: priceSteps.data,
            shippingCost: shippingCost.data
        });
    }

    handleProductCartItemChange(productCode, size, quantity) {
        const productCartItems = this.state.productCartItems;
        const productCartItem = productCartItems[productCode] || {};
        const cartItem = productCartItem[size] || new CartItem(productCode, size, quantity);

        cartItem.quantity = quantity;
        productCartItem[size] = cartItem;
        productCartItems[productCode] = productCartItem;

        this.setState({ productCartItems: productCartItems });
    }

    async handleDone() {
        const { productCartItems, deliveryInfo } = this.state;
        const { pageId, psId } = this.props.match.params;

        let cartItems = [];
        Object.keys(productCartItems)
            .map(code => productCartItems[code])
            .forEach(value => {
                cartItems = cartItems.concat(Object.keys(value).map(k => value[k]));
            });
        cartItems = cartItems.filter(item => item.quantity > 0);

        const result = await ShoppingCartApi.create(pageId, psId, cartItems, deliveryInfo);
        if (result.success) {
            // close webview
            message.success("Đơn hàng đã được gửi đi.\nBạn có thể đóng cửa sổ này!", 2, () => {
                window.closeWebview();
            });
        } else {
            message.error("Có lỗi xảy ra! Vui lòng thử lại!");
        }

        this.setState({
            isDeliveryInfoFormVisible: false,
            productCartItems: {},
            deliveryInfo: new DeliveryInfo()
        });
    }

    handleCancel() {
        this.setState({
            productCartItems: {},
            deliveryInfo: new DeliveryInfo()
        });
    }

    handleOpenUserForm() {
        const totalQuantity = this.calculateTotalQuantity(this.state.productCartItems);
        if (totalQuantity < 2) {
            message.error("Đơn hàng không đủ số lượng! (yêu cầu: 2)");
            return;
        }
        if (totalQuantity >= 20) {
            Modal.warning({
                title: 'Bạn muốn mua sỉ?',
                content: 'Nếu bạn mua số lượng từ 20 sản phẩm, vui lòng inbox số điện thoại cho page để nhân viên liên hệ sớm nhất với bạn!',
                centered: true,
            });
            return;
        }
        this.setState({ isDeliveryInfoFormVisible: true });
    }

    handleCloseUserForm() {
        this.setState({ isDeliveryInfoFormVisible: false });
    }

    handleDeliveryInfoChange(key, value) {
        const deliveryInfo = this.state.deliveryInfo;
        deliveryInfo[key] = value;
        this.setState({ deliveryInfo: deliveryInfo });
    }

    calculateTotalQuantity(productCartItems) {
        let count = 0;
        const codes = Object.keys(productCartItems);
        codes.forEach(code => {
            const productCartItem = productCartItems[code];
            const sizes = Object.keys(productCartItem);
            sizes.forEach(size => count += productCartItem[size].quantity);
        });

        return count;
    }

    calculatePrice(quantity) {
        const { priceSteps, shippingCost } = this.state;
        if (priceSteps.length === 0) return 0;

        const unitPrices = { 0: 0, 1: 0 };
        priceSteps.forEach(step => unitPrices[step.quantity] = step.price);
        const lastStepQuantity = priceSteps.slice(-1)[0].quantity;
        const totalPrice = quantity * unitPrices[quantity > lastStepQuantity ? lastStepQuantity : quantity];

        return totalPrice > 0 ? totalPrice + shippingCost : totalPrice;
    }

    render() {
        const {
            loading, products, isDeliveryInfoFormVisible,
            deliveryInfo, productCartItems, shippingCost
        } = this.state;

        const totalQuantity = this.calculateTotalQuantity(productCartItems);
        const price = this.calculatePrice(totalQuantity);
        const header = (
            <div className="header">
                <div>
                    <span className="quantity">Số lượng: {totalQuantity}</span>
                    <span className="price">
                        Tạm tính: {price} {price && shippingCost ? `(ship: ${shippingCost})` : ""}
                    </span>
                </div>
            </div>
        );

        return (
            <ProductLayout header={header}>
                <Card className="product-list"
                    style={{ width: '100%' }}
                    actions={[
                        <Button
                            onClick={this.handleCancel}
                            className="btn btn-cancel"
                            icon="close-circle">HỦY</Button>,
                        <Button
                            onClick={this.handleOpenUserForm}
                            className="btn btn-done"
                            icon="check">XONG</Button>
                    ]}
                >
                    <RichList
                        loading={loading}
                        header="Danh sách sản phẩm"
                        dataSource={products}
                        column={1}
                        renderItem={
                            product => <ProductCard key={product.id}
                                {...product}
                                cartItems={productCartItems[product.code] || {}}
                                handleProductCartItemChange={this.handleProductCartItemChange}
                            />
                        }
                    />
                    <DeliveryInfoForm isVisible={isDeliveryInfoFormVisible}
                        deliveryInfo={deliveryInfo}
                        onChange={this.handleDeliveryInfoChange}
                        onSubmit={this.handleDone}
                        onClose={this.handleCloseUserForm} />
                </Card>

            </ProductLayout>
        );
    }
}

export default Home;