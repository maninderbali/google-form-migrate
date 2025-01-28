// src/components/formManager.ts
import { StorageService } from './utils/storage'; // Import the StorageService class from the storage module
export class FormManager {
    constructor(formList, formPreview, formSubmitContainer, responseDisplayContainer, feedbackContainer, searchInput, sortButton, themeToggleButton, realTimePreviewContainer, bulkExportButton, addTextFieldButton, addMultipleChoiceButton, addCheckboxButton, saveFormButton, localStorageKey = 'forms') {
        this.formList = formList;
        this.formPreview = formPreview;
        this.formSubmitContainer = formSubmitContainer;
        this.responseDisplayContainer = responseDisplayContainer;
        this.feedbackContainer = feedbackContainer;
        this.searchInput = searchInput;
        this.sortButton = sortButton;
        this.themeToggleButton = themeToggleButton;
        this.realTimePreviewContainer = realTimePreviewContainer;
        this.bulkExportButton = bulkExportButton;
        this.addTextFieldButton = addTextFieldButton;
        this.addMultipleChoiceButton = addMultipleChoiceButton;
        this.addCheckboxButton = addCheckboxButton;
        this.saveFormButton = saveFormButton;
        this.localStorageKey = localStorageKey;
        this.forms = [];
        this.sortOrder = 'asc';
        this.currentTheme = 'light';
        this.currentFormFields = []; // Tracks fields for the currently building form
        this.storageService = new StorageService('app_');
        this.realTimePreviewElement = document.createElement('div');
        this.realTimePreviewElement.className = 'real-time-preview';
        this.realTimePreviewContainer.appendChild(this.realTimePreviewElement);
        this.loadForms();
        this.addSearchListener();
        this.addSortListener();
        this.addThemeToggleListener();
        this.addBulkExportListener();
        this.addFieldListeners();
        this.addSaveFormListener();
        this.applyTheme();
        this.renderFormList();
    }
    loadForms() {
        const storedForms = this.storageService.load(this.localStorageKey);
        if (storedForms) {
            this.forms = storedForms;
        }
    }
    saveForms() {
        this.storageService.save(this.localStorageKey, this.forms);
    }
    addSearchListener() {
        this.searchInput.addEventListener('input', () => this.renderFormList());
    }
    addSortListener() {
        this.sortButton.addEventListener('click', () => {
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
            this.renderFormList();
        });
    }
    addThemeToggleListener() {
        this.themeToggleButton.addEventListener('click', () => {
            this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', this.currentTheme);
            this.applyTheme();
            this.displayFeedback(`Theme changed to ${this.currentTheme === 'light' ? 'Light' : 'Dark'} mode.`);
        });
    }
    addBulkExportListener() {
        this.bulkExportButton.addEventListener('click', () => this.bulkExport());
    }
    addFieldListeners() {
        this.addTextFieldButton.addEventListener('click', () => {
            const field = {
                label: 'New Text Field',
                type: 'text',
                required: false,
            };
            this.currentFormFields.push(field);
            this.updateRealTimePreview(this.currentFormFields);
            this.displayFeedback('Text field added to the form.');
        });
        this.addMultipleChoiceButton.addEventListener('click', () => {
            const field = {
                label: 'New Multiple Choice',
                type: 'radio',
                required: false,
                options: ['Option 1', 'Option 2'],
            };
            this.currentFormFields.push(field);
            this.updateRealTimePreview(this.currentFormFields);
            this.displayFeedback('Multiple choice field added to the form.');
        });
        this.addCheckboxButton.addEventListener('click', () => {
            const numCheckboxes = parseInt(prompt('How many checkboxes do you want to add?') || '0', 10);
            if (isNaN(numCheckboxes) || numCheckboxes <= 0) {
                this.displayFeedback('Please enter a valid number greater than 0.');
                return;
            }
            const field = {
                label: 'New Checkbox',
                type: 'checkbox',
                required: false,
                options: Array.from({ length: numCheckboxes }, (_, i) => `Option ${i + 1}`),
            };
            this.currentFormFields.push(field);
            this.updateRealTimePreview(this.currentFormFields);
            this.displayFeedback(`${numCheckboxes} checkboxes added to the form.`);
        });
    }
    addSaveFormListener() {
        this.saveFormButton.addEventListener('click', () => {
            const formName = prompt('Enter a name for the form:');
            if (!formName) {
                this.displayFeedback('Form name is required.');
                return;
            }
            const newForm = {
                name: formName,
                fields: this.currentFormFields,
            };
            this.addForm(newForm);
            this.currentFormFields = []; // Clear the current fields
            this.updateRealTimePreview(this.currentFormFields); // Clear preview
            this.displayFeedback(`Form "${formName}" saved successfully.`);
        });
    }
    applyTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
        }
        document.body.className = this.currentTheme;
        this.themeToggleButton.textContent = `Switch to ${this.currentTheme === 'light' ? 'Dark' : 'Light'} Mode`;
    }
    addForm(form) {
        this.forms.push(form);
        this.saveForms();
        this.renderFormList();
        this.displayFeedback(`Form "${form.name}" added successfully.`);
    }
    renderFormList() {
        const query = this.searchInput.value.toLowerCase();
        let filteredForms = this.forms.filter((form) => form.name.toLowerCase().includes(query));
        // Sort forms by name based on the selected order
        filteredForms = filteredForms.sort((a, b) => {
            if (this.sortOrder === 'asc') {
                return a.name.localeCompare(b.name);
            }
            else {
                return b.name.localeCompare(a.name);
            }
        });
        this.formList.innerHTML = '';
        filteredForms.forEach((form, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'form-list-item';
            listItem.textContent = form.name;
            const viewBtn = document.createElement('button');
            viewBtn.className = 'btn btn-view';
            viewBtn.textContent = 'View';
            viewBtn.addEventListener('click', () => this.viewForm(form, index));
            const responsesBtn = document.createElement('button');
            responsesBtn.className = 'btn btn-responses';
            responsesBtn.textContent = 'Responses';
            responsesBtn.addEventListener('click', () => this.viewResponses(index));
            const exportBtn = document.createElement('button');
            exportBtn.className = 'btn btn-export';
            exportBtn.textContent = 'Export';
            exportBtn.addEventListener('click', () => this.exportFormData(index));
            const duplicateBtn = document.createElement('button');
            duplicateBtn.className = 'btn btn-duplicate';
            duplicateBtn.textContent = 'Duplicate';
            duplicateBtn.addEventListener('click', () => this.duplicateForm(index));
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-delete';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => this.deleteForm(index));
            listItem.appendChild(viewBtn);
            listItem.appendChild(responsesBtn);
            listItem.appendChild(exportBtn);
            listItem.appendChild(duplicateBtn);
            listItem.appendChild(deleteBtn);
            this.formList.appendChild(listItem);
        });
        // Update sort button text to reflect the current order
        this.sortButton.textContent = `Sort: ${this.sortOrder === 'asc' ? 'Ascending' : 'Descending'}`;
    }
    displayFeedback(message) {
        this.feedbackContainer.innerHTML = '';
        const feedbackMessage = document.createElement('div');
        feedbackMessage.className = 'feedback-message';
        feedbackMessage.textContent = message;
        this.feedbackContainer.appendChild(feedbackMessage);
        setTimeout(() => {
            feedbackMessage.remove();
        }, 3000);
    }
    updateRealTimePreview(fields, isPreview = false) {
        this.realTimePreviewElement.innerHTML = ''; // Clear previous preview
        const previewForm = document.createElement('form');
        previewForm.className = 'preview-form';
        fields.forEach((field, fieldIndex) => {
            const fieldWrapper = document.createElement('div');
            fieldWrapper.className = 'field-wrapper';
            let fieldLabel;
            if (isPreview) {
                // Render static label in preview mode
                fieldLabel = document.createElement('label');
                fieldLabel.textContent = field.label;
                fieldLabel.className = 'field-label';
            }
            else {
                // Render editable label in builder mode
                const labelInput = document.createElement('input');
                labelInput.type = 'text';
                labelInput.value = field.label;
                labelInput.className = 'field-label-input';
                labelInput.addEventListener('input', () => {
                    field.label = labelInput.value; // Update the field label dynamically
                });
                fieldLabel = labelInput;
            }
            fieldWrapper.appendChild(fieldLabel);
            let inputField;
            switch (field.type) {
                case 'text':
                    inputField = document.createElement('input');
                    inputField.type = 'text';
                    inputField.placeholder = field.label;
                    inputField.disabled = isPreview; // Disable in preview
                    break;
                case 'radio':
                    inputField = this.createRadioOptions(field, isPreview);
                    break;
                case 'checkbox':
                    inputField = this.createCheckboxOptions(field, isPreview);
                    break;
            }
            fieldWrapper.appendChild(inputField);
            previewForm.appendChild(fieldWrapper);
        });
        this.realTimePreviewElement.appendChild(previewForm);
    }
    viewForm(form, index) {
        this.formPreview.innerHTML = ''; // Clear previous preview
        const previewForm = document.createElement('form');
        previewForm.className = 'form-preview';
        form.fields.forEach((field) => {
            const fieldWrapper = document.createElement('div');
            fieldWrapper.className = 'field-wrapper';
            const fieldLabel = document.createElement('label');
            fieldLabel.textContent = field.label;
            fieldLabel.className = 'field-label';
            let inputField;
            switch (field.type) {
                case 'text':
                    inputField = document.createElement('input');
                    inputField.type = 'text';
                    inputField.placeholder = field.label;
                    inputField.required = field.required || false;
                    break;
                case 'radio':
                    inputField = this.createRadioOptions(field, true);
                    break;
                case 'checkbox':
                    inputField = this.createCheckboxOptions(field, true);
                    break;
            }
            fieldWrapper.appendChild(fieldLabel);
            fieldWrapper.appendChild(inputField);
            previewForm.appendChild(fieldWrapper);
        });
        this.formPreview.appendChild(previewForm);
    }
    viewResponses(index) {
        const responsesKey = `form_${index}_responses`;
        const responses = this.storageService.load(responsesKey) || [];
        this.responseDisplayContainer.innerHTML = ''; // Clear previous responses
        if (responses.length === 0) {
            this.responseDisplayContainer.textContent = 'No responses available.';
            return;
        }
        const responseList = document.createElement('ul');
        responseList.className = 'response-list';
        responses.forEach((response, responseIndex) => {
            const listItem = document.createElement('li');
            listItem.className = 'response-item';
            listItem.textContent = `Response ${responseIndex + 1}:`;
            const responseDetails = document.createElement('pre');
            responseDetails.textContent = JSON.stringify(response, null, 2);
            listItem.appendChild(responseDetails);
            responseList.appendChild(listItem);
        });
        this.responseDisplayContainer.appendChild(responseList);
    }
    exportFormData(index) {
        const form = this.forms[index];
        const responsesKey = `form_${index}_responses`;
        const responses = this.storageService.load(responsesKey) || [];
        const exportData = { form, responses };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${form.name}_data.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.displayFeedback(`Form "${form.name}" and its responses have been exported.`);
    }
    bulkExport() {
        const allFormsData = this.forms.map((form, index) => {
            const responsesKey = `form_${index}_responses`;
            const responses = this.storageService.load(responsesKey) || [];
            return { form, responses };
        });
        const blob = new Blob([JSON.stringify(allFormsData, null, 2)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'all_forms_data.json';
        downloadLink.click();
        URL.revokeObjectURL(url);
        this.displayFeedback('All forms and responses exported successfully.');
    }
    duplicateForm(index) {
        if (index >= 0 && index < this.forms.length) {
            const originalForm = this.forms[index];
            const duplicatedForm = Object.assign(Object.assign({}, originalForm), { name: `${originalForm.name} (Copy)` });
            this.addForm(duplicatedForm);
            this.displayFeedback(`Form "${originalForm.name}" duplicated successfully.`);
        }
    }
    deleteForm(index) {
        if (index >= 0 && index < this.forms.length) {
            const formName = this.forms[index].name;
            this.forms.splice(index, 1);
            this.saveForms();
            const responsesKey = `form_${index}_responses`;
            this.storageService.delete(responsesKey);
            this.renderFormList();
            this.displayFeedback(`Form "${formName}" deleted successfully.`);
        }
    }
    createRadioOptions(field, isPreview) {
        var _a;
        const container = document.createElement('div');
        container.className = 'radio-options';
        (_a = field.options) === null || _a === void 0 ? void 0 : _a.forEach((option, index) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'radio-option';
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = field.label;
            input.id = `${field.label}-option${index}`;
            input.value = option;
            input.disabled = isPreview; // Disable input in preview
            const label = document.createElement('label');
            label.htmlFor = input.id;
            if (isPreview) {
                // Show static label in preview
                label.textContent = option;
            }
            else {
                // Editable label in builder mode
                const labelInput = document.createElement('input');
                labelInput.type = 'text';
                labelInput.value = option;
                labelInput.className = 'radio-label';
                labelInput.addEventListener('input', () => {
                    field.options[index] = labelInput.value; // Update the option label dynamically
                });
                wrapper.appendChild(labelInput);
            }
            wrapper.appendChild(input);
            wrapper.appendChild(label);
            container.appendChild(wrapper);
        });
        return container;
    }
    createCheckboxOptions(field, isPreview) {
        var _a;
        const container = document.createElement('div');
        container.className = 'checkbox-options';
        (_a = field.options) === null || _a === void 0 ? void 0 : _a.forEach((option, index) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'checkbox-option';
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.name = field.label;
            input.id = `${field.label}-option${index}`;
            input.value = option;
            input.disabled = isPreview; // Disable input in preview
            const label = document.createElement('label');
            label.htmlFor = input.id;
            if (isPreview) {
                // Show static label in preview
                label.textContent = option;
            }
            else {
                // Editable label in builder mode
                const labelInput = document.createElement('input');
                labelInput.type = 'text';
                labelInput.value = option;
                labelInput.className = 'checkbox-label';
                labelInput.addEventListener('input', () => {
                    field.options[index] = labelInput.value; // Update the option label dynamically
                });
                wrapper.appendChild(labelInput);
            }
            wrapper.appendChild(input);
            wrapper.appendChild(label);
            container.appendChild(wrapper);
        });
        return container;
    }
    createSingleRadioOption(field, option, index) {
        const wrapper = document.createElement('div');
        wrapper.className = 'radio-option';
        // Radio input
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = field.label;
        input.id = `${field.label}-option${index}`;
        input.value = option;
        // Editable label
        const labelInput = document.createElement('input');
        labelInput.type = 'text';
        labelInput.value = option;
        labelInput.className = 'radio-label';
        // Update the field options dynamically
        labelInput.addEventListener('input', () => {
            field.options[index] = labelInput.value;
        });
        wrapper.appendChild(input);
        wrapper.appendChild(labelInput);
        return wrapper;
    }
    createSingleCheckboxOption(field, option, index) {
        const wrapper = document.createElement('div');
        wrapper.className = 'checkbox-option';
        // Checkbox input
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.name = field.label;
        input.id = `${field.label}-option${index}`;
        input.value = option;
        // Editable label
        const labelInput = document.createElement('input');
        labelInput.type = 'text';
        labelInput.value = option;
        labelInput.className = 'checkbox-label';
        // Update the field options dynamically
        labelInput.addEventListener('input', () => {
            field.options[index] = labelInput.value;
        });
        wrapper.appendChild(input);
        wrapper.appendChild(labelInput);
        return wrapper;
    }
}
