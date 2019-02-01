import { API_ROOT } from './api-config';

const shoppingCartApi = {
    create(pageId, psId, cartItems, deliveryInfo) {
        const data = {
            pageId,
            psId: psId,
            deliveryInfo: deliveryInfo,
            items: cartItems
        }

        const url = `${API_ROOT}/shopping-carts`;
        return fetch(url, {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'PageId': pageId,
            },
            method: "POST",
            mode: "cors"
        })
            .then(response => response.json())
            .then(res => {
                return res;
            })
            .catch(error => {
                console.error(error);
                return {
                    success: false,
                    error: error
                }
            });
    },
    // TODO (lec): add token to header and send request with fetch, then save the file
    // instead of passing as query param
    getExportCsvUrl(pageId, startDate, endDate, token) {
        return `${API_ROOT}/shopping-carts/export?pageId=${pageId}&dateStart=${startDate}&dateEnd=${endDate}&token=${token}`;
    }
};

export default shoppingCartApi;