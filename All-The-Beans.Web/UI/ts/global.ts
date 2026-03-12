import { FormValidator } from './modules/formValidation.js';
import { BeanSearch } from './modules/beanSearch.js';


const orderForm = document.querySelector<HTMLFormElement>('[data-form="order"]');

if (orderForm) {
    const validator = new FormValidator(orderForm, {
        firstName: { rules: [FormValidator.required('First name'), FormValidator.minLength(2)] },
        lastName:  { rules: [FormValidator.required('Last name'),  FormValidator.minLength(2)] },
        email:     { rules: [FormValidator.required('Email'), FormValidator.email] },
        phone:     { rules: [FormValidator.required('Phone'), FormValidator.phone] },
        beanType:  { rules: [FormValidator.required('Bean selection')] },
        quantity:  { rules: [FormValidator.required('Quantity')] },
        grind:     { rules: [FormValidator.required('Grind preference')] },
    });
    
    validator.bindSubmit((form) => {
        form.submit();
    });
}

new BeanSearch();