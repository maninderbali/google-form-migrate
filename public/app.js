"use strict";
// export const greet = (name: string): void => {
//   console.log(`Hello, ${name}!`);
// };
class FormBuilder {
    constructor() {
        this.forms = [];
        this.loadForms();
        this.setupEventListeners();
    }
    // Load saved forms from localStorage
    loadForms() {
        const savedForms = localStorage.getItem('forms');
        if (savedForms) {
            this.forms = JSON.parse(savedForms);
            this.renderFormList();
        }
    }
    // Save forms to localStorage
    saveForms() {
        localStorage.setItem('forms', JSON.stringify(this.forms));
    }
    // Event listeners for form creation
    setupEventListeners() {
        var _a, _b, _c, _d;
        (_a = document
            .getElementById('add-text-field')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => this.addField('text'));
        (_b = document
            .getElementById('add-radio-field')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => this.addField('radio'));
        (_c = document
            .getElementById('add-checkbox-field')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => this.addField('checkbox'));
        (_d = document
            .getElementById('save-form')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', () => this.saveForm());
    }
    // Add a new field to the form preview
    addField(type) {
        const formPreview = document.getElementById('form-preview');
        const fieldId = `field-${Date.now()}`;
        const label = prompt('Enter the label for the field:');
        if (!label)
            return;
        const field = { id: fieldId, type, label };
        if (type === 'radio' || type === 'checkbox') {
            const options = prompt('Enter options separated by commas:');
            if (options)
                field.options = options.split(',');
        }
        // Add field to the preview
        const fieldElement = document.createElement('div');
        fieldElement.id = fieldId;
        fieldElement.innerHTML = `<strong>${label}</strong> (${type})`;
        formPreview === null || formPreview === void 0 ? void 0 : formPreview.appendChild(fieldElement);
    }
    // Save the current form
    saveForm() {
        const formName = prompt('Enter a name for the form:');
        if (!formName)
            return;
        const formPreview = document.getElementById('form-preview');
        const fields = [];
        formPreview === null || formPreview === void 0 ? void 0 : formPreview.querySelectorAll('div').forEach((fieldElement) => {
            var _a, _b, _c;
            const id = fieldElement.id;
            const label = ((_a = fieldElement.querySelector('strong')) === null || _a === void 0 ? void 0 : _a.textContent) || '';
            const type = ((_c = (_b = fieldElement.textContent) === null || _b === void 0 ? void 0 : _b.split('(')[1]) === null || _c === void 0 ? void 0 : _c.split(')')[0]) || '';
            fields.push({ id, type, label });
        });
        const form = { id: `form-${Date.now()}`, name: formName, fields };
        this.forms.push(form);
        this.saveForms();
        alert('Form saved successfully!');
    }
    // Render the list of saved forms
    renderFormList() {
        const savedFormsList = document.getElementById('saved-forms');
        if (savedFormsList) {
            savedFormsList.innerHTML = '';
        }
        this.forms.forEach((form) => {
            const listItem = document.createElement('li');
            listItem.textContent = form.name;
            savedFormsList === null || savedFormsList === void 0 ? void 0 : savedFormsList.appendChild(listItem);
        });
    }
}
// Initialize the app
new FormBuilder();
