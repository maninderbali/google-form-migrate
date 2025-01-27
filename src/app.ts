// export const greet = (name: string): void => {
//   console.log(`Hello, ${name}!`);
// };

// greet('TypeScript');

interface FormField {
  id: string;
  type: string; // "text", "radio", "checkbox"
  label: string;
  options?: string[]; // Only for radio/checkbox
}

interface Form {
  id: string;
  name: string;
  fields: FormField[];
}

class FormBuilder {
  private forms: Form[] = [];

  constructor() {
    this.loadForms();
    this.setupEventListeners();
  }

  // Load saved forms from localStorage
  private loadForms(): void {
    const savedForms = localStorage.getItem('forms');
    if (savedForms) {
      this.forms = JSON.parse(savedForms);
      this.renderFormList();
    }
  }

  // Save forms to localStorage
  private saveForms(): void {
    localStorage.setItem('forms', JSON.stringify(this.forms));
  }

  // Event listeners for form creation
  private setupEventListeners(): void {
    document
      .getElementById('add-text-field')
      ?.addEventListener('click', () => this.addField('text'));
    document
      .getElementById('add-radio-field')
      ?.addEventListener('click', () => this.addField('radio'));
    document
      .getElementById('add-checkbox-field')
      ?.addEventListener('click', () => this.addField('checkbox'));
    document
      .getElementById('save-form')
      ?.addEventListener('click', () => this.saveForm());
  }

  // Add a new field to the form preview
  private addField(type: string): void {
    const formPreview = document.getElementById('form-preview');
    const fieldId = `field-${Date.now()}`;
    const label = prompt('Enter the label for the field:');
    if (!label) return;

    const field: FormField = { id: fieldId, type, label };

    if (type === 'radio' || type === 'checkbox') {
      const options = prompt('Enter options separated by commas:');
      if (options) field.options = options.split(',');
    }

    // Add field to the preview
    const fieldElement = document.createElement('div');
    fieldElement.id = fieldId;
    fieldElement.innerHTML = `<strong>${label}</strong> (${type})`;
    formPreview?.appendChild(fieldElement);
  }

  // Save the current form
  private saveForm(): void {
    const formName = prompt('Enter a name for the form:');
    if (!formName) return;

    const formPreview = document.getElementById('form-preview');
    const fields: FormField[] = [];

    formPreview?.querySelectorAll('div').forEach((fieldElement) => {
      const id = fieldElement.id;
      const label = fieldElement.querySelector('strong')?.textContent || '';
      const type = fieldElement.textContent?.split('(')[1]?.split(')')[0] || '';
      fields.push({ id, type, label });
    });

    const form: Form = { id: `form-${Date.now()}`, name: formName, fields };
    this.forms.push(form);
    this.saveForms();
    alert('Form saved successfully!');
  }

  // Render the list of saved forms
  private renderFormList(): void {
    const savedFormsList = document.getElementById('saved-forms');
    if (savedFormsList) {
      savedFormsList.innerHTML = '';
    }

    this.forms.forEach((form) => {
      const listItem = document.createElement('li');
      listItem.textContent = form.name;
      savedFormsList?.appendChild(listItem);
    });
  }
}

// Initialize the app
new FormBuilder();
