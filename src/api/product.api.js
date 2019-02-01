import { API_ROOT } from './api-config';

const productApi = {
    get(pageId, path) {
        const url = `${API_ROOT}/${path}`;

        return fetch(url, {
            headers: {
                'PageId': pageId,
            },
        })
            .then(res => res.json())
            .then(
                (result) => {
                    return { data: result.data };
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    return {
                        error: error,
                        data: []
                    };
                }
            )
    },

    getProducts(pageId) {
        return this.get(pageId, "products");
    },

    getPriceSteps(pageId) {
        return this.get(pageId, "products/price-steps");
    },

    getShippingCost(pageId) {
        return this.get(pageId, "products/cost/ship");
    }
};

export default productApi;