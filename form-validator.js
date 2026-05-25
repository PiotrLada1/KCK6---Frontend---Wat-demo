 // form-validator.js
class FormValidator {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        this.rules = new Map();
        this.init();
    }
    addRule(fieldName, validator, message) {
    if (!this.rules.has(fieldName)) this.rules.set(fieldName, []);
    this.rules.get(fieldName).push({ validator, message });
    return this; // fluent API
    }

    init() {
        this.form?.addEventListener('submit', async (e) => {
            e.preventDefault();
        if (this.validate()) await this.submit();
        });

        this.form?.querySelectorAll('input, textarea').forEach(field =>
        {
            field.addEventListener('blur', () => this.validateField(field
            ));
        });
    }

    validate() {
        let valid = true;
        this.form.querySelectorAll('[name]').forEach(field => {
            if (!this.validateField(field)) valid = false;
        });
        return valid;
    }

    validateField(field) {
        const fieldRules = this.rules.get(field.name) || [];
        for (const { validator, message } of fieldRules) {
            if (!validator(field.value)) {
                field.setCustomValidity(message);
                field.reportValidity();
                field.classList.add('invalid');
                return false;
            }
        }
        field.setCustomValidity('');
        field.classList.remove('invalid');
        field.classList.add('valid');
        return true;
    }

    async submit() {
        const btn = this.form.querySelector('[type=submit]');
        const formData = new FormData(this.form);
        console.log('Wysłane dane:', {
        name: formData.get('name'),
        email: formData.get('email'),
        msg: formData.get('msg')
    });
        btn.textContent = 'Wysylanie...';
        btn.disabled = true;
        // Symulacja wysylania
        await new Promise(r => setTimeout(r, 1500));
        btn.textContent = 'Wyslano!';
        this.form.reset();
    }
}

const validator = new FormValidator('#contact-form')
.addRule('email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Podaj poprawny e-mail')
.addRule('name', v => v.trim().length >= 2, 'Imie musi miec min. 2 znaki')
.addRule('msg', v => v.trim().length >= 10, 'Wiadomosc musi miec min. 10 znakow');