export interface Field {
  label: string;
  type: 'text' | 'radio' | 'checkbox';
  required?: boolean;
  value?: string; // For text and radio fields
  values?: string[]; // For checkbox fields
  options?: string[]; // For radio and checkbox options
}

export interface Form {
  name: string; // Name of the form
  fields: Field[]; // Array of fields in the form
}
