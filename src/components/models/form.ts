export interface Field {
  label: string; // Field label displayed to users
  type: 'text' | 'radio' | 'checkbox'; // Type of the field
  placeholder?: string; // Placeholder text for text fields
  required?: boolean; // Whether the field is required
  minLength?: number; // Minimum length for text fields
  maxLength?: number; // Maximum length for text fields
  pattern?: string; // Pattern for validation (e.g., regex)
  options?: string[]; // Options for radio or checkbox fields
}

export interface Form {
  name: string; // Name of the form
  fields: Field[]; // Array of fields in the form
}
