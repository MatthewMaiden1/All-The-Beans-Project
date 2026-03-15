interface ValidationRule {
    validate: (value: string) => boolean;
    message: string;
}

interface FieldConfig {
    rules: ValidationRule[];
}

type FormConfig = Record<string, FieldConfig>;

interface ValidationResult {
    valid: boolean;
    errors: Record<string, string>;
}

export class OrderForm {
    private readonly form: HTMLFormElement;
    private readonly config: FormConfig;
    private readonly beanSelect: HTMLSelectElement | null;
    private readonly quantityInput: HTMLInputElement | null;
    private readonly priceDisplay: HTMLElement | null;
    private readonly costMap: Record<string, number>;

    constructor(form: HTMLFormElement) {
        this.form         = form;
        this.beanSelect   = form.querySelector<HTMLSelectElement>('#beanType');
        this.quantityInput = form.querySelector<HTMLInputElement>('#quantity');
        this.priceDisplay = form.querySelector<HTMLElement>('[data-price-display]');
        this.costMap      = this.parseCostMap(JSON.parse(form.dataset.beanCosts ?? '{}'));

        this.config = {
            firstName: { rules: [OrderForm.required('First name'), OrderForm.minLength(2)] },
            lastName:  { rules: [OrderForm.required('Last name'),  OrderForm.minLength(2)] },
            email:     { rules: [OrderForm.required('Email'),      OrderForm.email] },
            phone:     { rules: [OrderForm.required('Phone'),      OrderForm.phone] },
            address:   { rules: [OrderForm.required('Address'), OrderForm.minLength(5)] },
            beanType:  { rules: [OrderForm.required('Bean selection')] },
            quantity:  { rules: [OrderForm.required('Quantity')] },
        };

        this.beanSelect?.addEventListener('change', () => this.updatePrice());
        this.quantityInput?.addEventListener('input', () => this.updatePrice());
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
            } else {
                this.showErrors(data.errors);
            }
        });
    }

    static required(label: string): ValidationRule {
        return {
            validate: (value) => value.trim().length > 0,
            message: `${label} is required`,
        };
    }

    static minLength(n: number): ValidationRule {
        return {
            validate: (value) => value.trim().length >= n,
            message: `Must be at least ${n} characters`,
        };
    }

    static readonly email: ValidationRule = {
        validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
        message: 'Enter a valid email address',
    };

    static readonly phone: ValidationRule = {
        validate: (value) =>
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
                value.trim().replace(/\s/g, '')
            ),
        message: 'Enter a valid phone number',
    };

    private validate(): ValidationResult {
        const errors: Record<string, string> = {};

        for (const [fieldName, { rules }] of Object.entries(this.config)) {
            const fieldElement = this.form.elements.namedItem(fieldName) as
                | HTMLInputElement
                | HTMLSelectElement
                | null;

            if (!fieldElement) continue;

            for (const rule of rules) {
                if (!rule.validate(fieldElement.value)) {
                    errors[fieldName] = rule.message;
                    break;
                }
            }
        }

        return { valid: Object.keys(errors).length === 0, errors };
    }

    private showErrors(errors: Record<string, string>): void {
        this.clearErrors();

        for (const [field, message] of Object.entries(errors)) {
            const input   = this.form.elements.namedItem(field) as HTMLElement | null;
            const errorEl = this.form.querySelector<HTMLElement>(`[data-error="${field}"]`);

            input?.classList.add('border-red-500');
            if (errorEl) {
                errorEl.textContent = message;
                errorEl.hidden      = false;
            }
        }
    }

    private clearErrors(): void {
        this.form.querySelectorAll<HTMLElement>('[data-error]').forEach((errorEl) => {
            errorEl.textContent = '';
            errorEl.hidden      = true;
        });
        this.form.querySelectorAll('[data-field]').forEach((fieldInput) =>
            fieldInput.classList.remove('border-red-500')
        );
    }

    private parseCostMap(raw: Record<string, string>): Record<string, number> {
        const parsed: Record<string, number> = {};
        for (const [name, costString] of Object.entries(raw)) {
            const numericValue = parseFloat(costString.replace(/[^0-9.]/g, ''));
            if (!isNaN(numericValue)) parsed[name] = numericValue;
        }
        return parsed;
    }

    private updatePrice(): void {
        if (!this.beanSelect || !this.quantityInput || !this.priceDisplay) return;

        const selectedBeanName = this.beanSelect.value;
        const quantity         = parseInt(this.quantityInput.value, 10);
        const unitCost         = this.costMap[selectedBeanName];

        if (!selectedBeanName || isNaN(quantity) || quantity < 1 || unitCost === undefined) {
            this.priceDisplay.textContent = '';
            this.priceDisplay.hidden      = true;
            return;
        }

        this.priceDisplay.textContent = `Total: £${(unitCost * quantity).toFixed(2)}`;
        this.priceDisplay.hidden      = false;
    }
}
