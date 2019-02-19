import React, { Component } from 'react';
import { Card } from 'antd';
import InputNumber from './input-number';
import './index.scss';

class ProductCard extends Component {
    constructor(props) {
        super(props);
        this.handleValueChange = this.handleValueChange.bind(this);
    }

    handleValueChange(size, quantity) {
        const { code, handleProductCartItemChange } = this.props;
        handleProductCartItemChange(code, size, quantity);
    }

    render() {
        const {
            code, images, sizes,
            cartItems
        } = this.props;

        const availableSizes = sizes || [
            { key: "M", label: "M" },
            { key: "L", label: "L" },
            { key: "XL", label: "XL" },
            { key: "XXL", label: "XXL" },
        ];

        return (
            <Card
                className="product-card"
                hoverable
                cover={
                    <div className="product-bg" style={{ backgroundImage: `url(${images[0].thumbnails.large.url})` }}>
                        <div className="code">{code}</div>
                    </div>
                }
            >
                <div className="inputs">
                    {
                        availableSizes.map(size =>
                            <span key={size.key}>
                                <label>{size.label}</label>
                                <InputNumber value={(cartItems[size.key] || {}).quantity || 0}
                                    onChange={value => this.handleValueChange(size.key, value)}
                                    min={0} max={1000} />
                            </span>
                        )
                    }
                </div>
            </Card>
        );
    }
}

export default ProductCard;