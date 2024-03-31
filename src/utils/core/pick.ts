/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
export const pick = (object: any, keys: string[]) => {
  return keys.reduce((obj: any, key: string) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      if (key == 'search') {
        if (!!object[key]) {
          obj['$text'] = {$search: object[key]};
        }
      } else {
        obj[key] = object[key];
      }
    }
    return obj;
  }, {});
};
