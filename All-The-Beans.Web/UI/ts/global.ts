import { OrderForm } from './modules/orderForm.js';
import { BeanSearch } from './modules/beanSearch.js';
import { NavMenu } from './modules/navMenu.js';

const orderFormElement = document.querySelector<HTMLFormElement>('[data-form="order"]');

if (orderFormElement) {
    new OrderForm(orderFormElement);
}

if (document.querySelector('[data-search="beans"]')) {
    new BeanSearch();
}

new NavMenu();