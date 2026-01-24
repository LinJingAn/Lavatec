// Type declaration to help TypeScript resolve react-hook-form exports
declare module 'react-hook-form' {
  export interface UseFormProps<TFieldValues = any, TContext = any> {
    resolver?: any;
    defaultValues?: any;
    mode?: 'onSubmit' | 'onBlur' | 'onChange' | 'onTouched' | 'all';
  }
  
  export interface UseFormReturn<TFieldValues = any, TContext = any> {
    register: (name: any, options?: any) => any;
    handleSubmit: (onSubmit: any) => (e?: any) => void;
    formState: {
      errors: Record<string, any>;
      isValid: boolean;
      isDirty: boolean;
      touchedFields: Record<string, any>;
    };
    watch: (name?: any) => any;
    setValue: (name: any, value: any, options?: any) => void;
    getValues: (name?: any) => any;
    reset: (values?: any) => void;
    trigger: (name?: any) => Promise<boolean>;
  }
  
  export function useForm<TFieldValues = any, TContext = any>(
    props?: UseFormProps<TFieldValues, TContext>
  ): UseFormReturn<TFieldValues, TContext>;
}


