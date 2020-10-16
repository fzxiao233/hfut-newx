const num2Text = (num) => {
    const tenUnit = "十";
    const zh = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    const numLength = String(num).length;
    if (numLength === 1) {
        return zh[num];
    } else if (num === 20) {
        return zh[Number(String(num).charAt(0))]+ tenUnit;
    } else {
        return tenUnit + zh[num - 10];
    }
};

const reduceObj = (obj) => {
    let result = [];
    let toFlatArray = function (obj) {
        Object.values(obj).forEach(function (i) {
            i instanceof Object ? toFlatArray(i): result.push(i)
        })
    };
    toFlatArray(obj);
    return result;
};

export {reduceObj, num2Text}