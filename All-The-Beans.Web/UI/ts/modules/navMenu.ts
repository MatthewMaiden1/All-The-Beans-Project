export class NavMenu {
    private readonly toggleButton!: HTMLButtonElement;
    private readonly mobileMenu!: HTMLElement;
    private readonly openIcon!: HTMLElement;
    private readonly closeIcon!: HTMLElement;
    private isOpen: boolean = false;

    constructor() {
        const toggleButton = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
        const mobileMenu   = document.querySelector<HTMLElement>('[data-nav-menu]');
        const openIcon     = document.querySelector<HTMLElement>('[data-nav-icon-open]');
        const closeIcon    = document.querySelector<HTMLElement>('[data-nav-icon-close]');

        if (!toggleButton || !mobileMenu || !openIcon || !closeIcon) return;

        this.toggleButton = toggleButton;
        this.mobileMenu   = mobileMenu;
        this.openIcon     = openIcon;
        this.closeIcon    = closeIcon;

        this.toggleButton.addEventListener('click', () => this.toggle());
    }

    private toggle(): void {
        this.isOpen = !this.isOpen;

        this.mobileMenu.classList.toggle('hidden', !this.isOpen);
        this.mobileMenu.classList.toggle('flex', this.isOpen);
        this.openIcon.classList.toggle('hidden', this.isOpen);
        this.closeIcon.classList.toggle('hidden', !this.isOpen);
    }
}
