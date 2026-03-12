export interface ValidationRule {
    validate: (value: string) => boolean;
    message: string;
}

export interface FieldConfig {
    rules: ValidationRule[];
}

export type FormConfig = Record<string, FieldConfig>;

export interface ValidationResult {
    valid: boolean;
    errors: Record<string, string>;
}

export class FormValidator {
    private form: HTMLFormElement;
    private config: FormConfig;

    constructor(form: HTMLFormElement, config: FormConfig) {
        this.form = form;
        this.config = config;
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

    validate(): ValidationResult {
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

    showErrors(errors: Record<string, string>): void {
        this.clearErrors();

        for (const [field, message] of Object.entries(errors)) {
            const input = this.form.elements.namedItem(field) as HTMLElement | null;
            const errorEl = this.form.querySelector<HTMLElement>(`[data-error="${field}"]`);

            input?.classList.add('border-red-500');
            if (errorEl) {
                errorEl.textContent = message;
                errorEl.hidden = false;
            }
        }
    }

    clearErrors(): void {
        this.form.querySelectorAll<HTMLElement>('[data-error]').forEach((error) => {
            error.textContent = '';
            error.hidden = true;
        });
        this.form.querySelectorAll('[data-field]').forEach((fieldInput) =>
            fieldInput.classList.remove('border-red-500')
        );
    }

    bindSubmit(onValid: (form: HTMLFormElement) => void): void {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.clearErrors();

            const result = this.validate();

            if (!result.valid) {
                this.showErrors(result.errors);
                return;
            }

            onValid(this.form);
        });
    }
}
