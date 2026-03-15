export class BeanSearch {
    constructor() {
        const input = document.querySelector('[data-search="beans"]');
        if (!input)
            return;
        this.input = input;
        this.items = Array.from(document.querySelectorAll('[data-bean-item]'));
        this.input.addEventListener('input', () => this.filter());
    }
    filter() {
        const query = this.input.value.toLowerCase().trim();
        this.items.forEach((item) => {
            var _a, _b;
            const text = (_b = (_a = item.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : '';
            item.style.display = text.includes(query) ? '' : 'none';
        });
    }
}
