export class FormBuilder {
    constructor(fieldType, fieldLabel, addFieldBtn, formPreview) {
        this.fieldType = fieldType;
        this.fieldLabel = fieldLabel;
        this.addFieldBtn = addFieldBtn;
        this.formPreview = formPreview;
        this.currentForm = [];
        this.initialize();
    }
    initialize() {
        this.addFieldBtn.addEventListener('click', () => this.addField());
    }
    addField() {
        const type = this.fieldType.value;
        const label = this.fieldLabel.value;
        if (!label) {
            alert('Please enter a label for the field.');
            return;
        }
        const field = { type, label };
        this.currentForm.push(field);
        this.renderField(field);
        this.fieldLabel.value = ''; // Clear input after adding
    }
    renderField(field) {
        const fieldWrapper = document.createElement('div');
        fieldWrapper.className = 'field-wrapper';
        const fieldLabel = document.createElement('label');
        fieldLabel.textContent = field.label;
        let inputField;
        switch (field.type) {
            case 'text':
                inputField = document.createElement('input');
                inputField.type = 'text';
                inputField.placeholder = field.label;
                break;
            case 'radio':
                inputField = document.createElement('div');
                inputField.innerHTML = `
          <input type="radio" name="${field.label}" id="${field.label}-option1">
          <label for="${field.label}-option1">Option 1</label>
          <input type="radio" name="${field.label}" id="${field.label}-option2">
          <label for="${field.label}-option2">Option 2</label>
        `;
                break;
            case 'checkbox':
                inputField = document.createElement('div');
                inputField.innerHTML = `
          <input type="checkbox" id="${field.label}-checkbox">
          <label for="${field.label}-checkbox">${field.label}</label>
        `;
                break;
            default:
                return;
        }
        fieldWrapper.appendChild(fieldLabel);
        fieldWrapper.appendChild(inputField);
        this.formPreview.appendChild(fieldWrapper);
    }
    getCurrentForm() {
        return this.currentForm;
    }
}
