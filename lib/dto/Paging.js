'use strict';
class Paging {
    get total() {
        let total = this.count / this.size;
        if (total === 0 || this.count % this.size !== 0) {
            total++;
        }
        return total;
    }

    get index() {
        let index = (this.num - 1) * this.size;
        return index < 0 ? 0 : index;
    }
}
Reflect.defineProperty(Paging, 'num', {writable: true, configurable: false, value: 0});
Reflect.defineProperty(Paging, 'size', {writable: true, configurable: false, value: 0});
Reflect.defineProperty(Paging, 'count', {writable: true, configurable: false, value: 0});
Reflect.defineProperty(Paging, 'items', {writable: true, configurable: false, value: []});
module.exports = Paging;