import React, { Component } from 'react';
import { Button } from 'antd';

class InputNumber extends Component {
    constructor(props) {
        super(props);
        this.handleMinus = this.handleMinus.bind(this);
        this.handlePlus = this.handlePlus.bind(this);
        this.inputRef = React.createRef();
    }

    handleMinus() {
        const currentValue = parseInt(this.inputRef.current.value);
        const min = this.props.min;
        const newValue = currentValue > min ? currentValue - 1 : min;
        this.inputRef.current.value = newValue;
        this.props.onChange(newValue);
    }

    handlePlus() {
        const currentValue = parseInt(this.inputRef.current.value);
        const max = this.props.max;
        const newValue = currentValue < max ? currentValue + 1 : max;
        this.inputRef.current.value = newValue;
        this.props.onChange(newValue);
    }

    render() {
        const { value, onChange, min, max } = this.props;
        return (
            <div className="rich-input-number">
                <Button size="large" icon="minus-circle" onClick={this.handleMinus} />
                <input className="ant-input" type="number"
                    ref={this.inputRef}
                    onChange={e => onChange(parseInt(e.target.value.replace(/^0/, "")) || 0)}
                    value={value}
                    min={min} max={max}
                />
                <Button size="large" icon="plus-circle" onClick={this.handlePlus} />
            </div>
        );
    }
}

export default InputNumber;