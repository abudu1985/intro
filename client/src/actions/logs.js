import {isEqual, isObject, transform} from "lodash";

export function difference(object, base) {
    let allState = transform(object, (result, value, key) => {
        if (!isEqual(value, base[key])) {
            result[key] = isObject(value) && isObject(base[key]) ? this.difference(value, base[key]) : value;
        }
    });
    let change = allState.filter(function (el) {
        return el != null;
    });
    return change[0];
}