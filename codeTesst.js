function removeUndefinedFields(obj) {
    // Tạo một đối tượng rỗng để lưu trữ kết quả
    const result = {};

    // Duyệt qua các trường của đối tượng
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            // Nếu giá trị không phải là undefined, thêm vào kết quả
            if (value !== undefined) {
                // Nếu giá trị là một đối tượgng, gọi đệ quy để loại bỏ các trường undefined bên trong nó
                if (typeof value === 'object' && value !== null) {
                    result[key] = removeUndefinedFields(value);
                } else {
                    result[key] = value;
                }
            }
        }
    }

    return result;
}

// Ví dụ sử dụng hàm
const array1 = {
    name: 'staring 1',
    name2: undefined,
    name3: 'String 3',
    attributes: {
        brand: 'String 1',
        size: undefined,
        color: 'red'
    }
};

const cleanedArray = removeUndefinedFields(array1);
console.log(cleanedArray);