export class FormValidator {
    constructor(form, config) {
        this.form = form;
        this.config = config;
    }
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
        this.form.querySelectorAll('[data-error]').forEach((error) => {
            error.textContent = '';
            error.hidden = true;
        });
        this.form.querySelectorAll('[data-field]').forEach((fieldInput) => fieldInput.classList.remove('border-red-500'));
    }
    bindSubmit(onValid) {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            this.clearErrors();
            const result = this.validate();
            if (!result.valid) {
                this.showErrors(result.errors);
                return;
            }
            await onValid(this.form);
        });
    }
}
FormValidator.email = {
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
    message: 'Enter a valid email address',
};
FormValidator.phone = {
    validate: (value) => /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(value.trim().replace(/\s/g, '')),
    message: 'Enter a valid phone number',
};
