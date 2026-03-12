export class BeanSearch {
    private input!: HTMLInputElement;
    private items!: HTMLElement[];

    constructor() {
        const input = document.querySelector<HTMLInputElement>('[data-search="beans"]');
        if (!input) return;

        this.input = input;
        this.items = Array.from(document.querySelectorAll<HTMLElement>('[data-bean-item]'));

        this.input.addEventListener('input', () => this.filter());
    }

    private filter(): void {
        const query = this.input.value.toLowerCase().trim();

        this.items.forEach((item) => {
            const text = item.textContent?.toLowerCase() ?? '';
            item.style.display = text.includes(query) ? '' : 'none';
        });
    }
}
