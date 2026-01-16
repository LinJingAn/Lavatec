import { useState } from 'react';

interface ValidationRules<T> {
  [key: string]: (value: any, formData: T) => string | undefined;
}

/**
 * Custom hook for form validation
 * @param initialFormData Initial form data
 * @param validationRules Rules for validation
 * @returns Form hooks and methods
 */
export function useFormValidation<T extends Record<string, any>>(
  initialFormData: T,
  validationRules: ValidationRules<T>
) {
  const [formData, setFormData] = useState<T>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>> & { submit?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name as keyof T]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof typeof newErrors];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    
    // Apply validation rules
    Object.keys(validationRules).forEach(field => {
      const rule = validationRules[field];
      const errorMessage = rule(formData[field], formData);
      if (errorMessage) {
        newErrors[field as keyof T] = errorMessage;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setIsSubmitting(false);
    setSubmitSuccess(false);
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    isSubmitting,
    setIsSubmitting,
    submitSuccess,
    setSubmitSuccess,
    handleChange,
    validateForm,
    resetForm
  };
}

// Example usage:
/*
const { formData, handleChange, errors, validateForm, setErrors, setIsSubmitting, isSubmitting, submitSuccess, setSubmitSuccess } = useFormValidation({
  name: '',
  email: '',
  age: ''
}, {
  name: (value) => !value.trim() ? 'Name is required' : undefined,
  email: (value) => {
    if (!value.trim()) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
    return undefined;
  },
  age: (value) => {
    if (!value.trim()) return 'Age is required';
    if (isNaN(Number(value))) return 'Age must be a number';
    return undefined;
  }
});
*/ 