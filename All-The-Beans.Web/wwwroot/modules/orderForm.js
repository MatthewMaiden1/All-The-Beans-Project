export class OrderForm {
    constructor(form) {
        var _a, _b, _c;
        this.form = form;
        this.beanSelect = form.querySelector('#beanType');
        this.quantityInput = form.querySelector('#quantity');
        this.priceDisplay = form.querySelector('[data-price-display]');
        this.costMap = this.parseCostMap(JSON.parse((_a = form.dataset.beanCosts) !== null && _a !== void 0 ? _a : '{}'));
        this.config = {
            firstName: { rules: [OrderForm.required('First name'), OrderForm.minLength(2)] },
            lastName: { rules: [OrderForm.required('Last name'), OrderForm.minLength(2)] },
            email: { rules: [OrderForm.required('Email'), OrderForm.email] },
            phone: { rules: [OrderForm.required('Phone'), OrderForm.phone] },
            beanType: { rules: [OrderForm.required('Bean selection')] },
            quantity: { rules: [OrderForm.required('Quantity')] },
        };
        (_b = this.beanSelect) === null || _b === void 0 ? void 0 : _b.addEventListener('change', () => this.updatePrice());
        (_c = this.quantityInput) === null || _c === void 0 ? void 0 : _c.addEventListener('input', () => this.updatePrice());
        this.updatePrice();
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            this.clearErrors();
            const result = this.validate();
            if (!result.valid) {
                this.showErrors(result.errors);
                return;
            }
            const response = await fetch(this.form.action, {
                method: 'POST',
                body: new FormData(this.form),
            });
            const data = await response.json();
            if (data.success) {
                window.location.href = data.redirectUrl;
            }
            else {
                this.showErrors(data.errors);
            }
        });
    }
    // --- Validation rules ---
    static required(label) {
        return {
            validate: (value) => value.trim().length > 0,
            message: `${label} is required`,
        };
    }
    static minLength(n) {
        return {
            validate: (value) => value.trim().length >= n,
            message: `Must be at least ${n} characters`,
        };
    }
    // --- Validation logic ---
    validate() {
        const errors = {};
        for (const [fieldName, { rules }] of Object.entries(this.config)) {
            const fieldElement = this.form.elements.namedItem(fieldName);
            if (!fieldElement)
                continue;
            for (const rule of rules) {
                if (!rule.validate(fieldElement.value)) {
                    errors[fieldName] = rule.message;
                    break;
                }
            }
        }
        return { valid: Object.keys(errors).length === 0, errors };
    }
    showErrors(errors) {
        this.clearErrors();
        for (const [field, message] of Object.entries(errors)) {
            const input = this.form.elements.namedItem(field);
            const errorEl = this.form.querySelector(`[data-error="${field}"]`);
            input === null || input === void 0 ? void 0 : input.classList.add('border-red-500');
            if (errorEl) {
                errorEl.textContent = message;
                errorEl.hidden = false;
            }
        }
    }
    clearErrors() {
        this.form.querySelectorAll('[data-error]').forEach((errorEl) => {
            errorEl.textContent = '';
            errorEl.hidden = true;
        });
        this.form.querySelectorAll('[data-field]').forEach((fieldInput) => fieldInput.classList.remove('border-red-500'));
    }
    // --- Price calculation ---
    parseCostMap(raw) {
        const parsed = {};
        for (const [name, costString] of Object.entries(raw)) {
            const numericValue = parseFloat(costString.replace(/[^0-9.]/g, ''));
            if (!isNaN(numericValue))
                parsed[name] = numericValue;
        }
        return parsed;
    }
    updatePrice() {
        if (!this.beanSelect || !this.quantityInput || !this.priceDisplay)
            return;
        const selectedBeanName = this.beanSelect.value;
        const quantity = parseInt(this.quantityInput.value, 10);
        const unitCost = this.costMap[selectedBeanName];
        if (!selectedBeanName || isNaN(quantity) || quantity < 1 || unitCost === undefined) {
            this.priceDisplay.textContent = '';
            this.priceDisplay.hidden = true;
            return;
        }
        this.priceDisplay.textContent = `Total: £${(unitCost * quantity).toFixed(2)}`;
        this.priceDisplay.hidden = false;
    }
}
OrderForm.email = {
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
    message: 'Enter a valid email address',
};
OrderForm.phone = {
    validate: (value) => /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(value.trim().replace(/\s/g, '')),
    message: 'Enter a valid phone number',
};
