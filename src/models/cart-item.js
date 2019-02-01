class CartItem {
    constructor(code = "", size = "", quantity = 0) {
        this.code = code;
        this.size = size;
        this.quantity = quantity;
    }

    toInfoObject() {
        return {
            code: this.code + this.size,
            quantity: this.quantity,
        }
    }
}

export default CartItem;