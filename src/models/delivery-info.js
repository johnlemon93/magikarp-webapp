class DeliveryInfo {
    constructor(name = "", phone = "", city = "", district = "", address = "", note = "") {
        this.name = name;
        this.phone = phone;
        this.city = city;
        this.district = district;
        this.address = address;
        this.note = note;
    }

    static getFieldNames() {
        return [
            "name",
            "phone",
            "city",
            "district",
            "address",
            "note",
        ];
    }

    static validate(obj) {
        // currently only validate phone number
        const phone = obj.phone;
        if (!phone.match(/^\d{10}$/)) {
            return "Vui lòng nhập số điện thoại có 10 chữ số";
        }
        const dausoViettel = ['032', '033', '034', '035', '036', '037', '038', '039', '086', '096', '097', '098'];
        const dausoMobifone = ['079', '077', '076', '078', '070', '089', '090', '093'];
        const dausoVinafone = ['085', '083', '084', '081', '082', '056', '091', '094'];
        const dausoOthers = ['058', '056', '092', '059'];
        const allDauso = [...dausoViettel, ...dausoMobifone, ...dausoVinafone, ...dausoOthers];

        if (!allDauso.includes(phone.slice(0, 3))) {
            return "Vui lòng nhập đúng đầu số!";
        }

        return null;
    }

    static getPlaceHolder(fieldName) {
        return {
            name: "Tên Facebook của bạn. VD: Ngân Nguyễn",
            phone: "Số điện thoại",
            city: "Tỉnh/Thành phố",
            district: "Quận/Huyện",
            address: "Địa chỉ. VD: 15 Hoàng Diệu, Đà Nẵng",
            note: "Ghi chú thêm",
        }[fieldName];
    }
}

export default DeliveryInfo;