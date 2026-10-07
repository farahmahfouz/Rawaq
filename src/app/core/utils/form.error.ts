import { AbstractControl } from '@angular/forms';

export function getControlError(ctrl: AbstractControl | null | undefined): string {
  if (!ctrl?.touched || !ctrl.errors) return '';

  const messages: Record<string, string> = {
    required: 'Required',
    email: 'Please enter a valid email',
    minlength: `Minimum length is ${ctrl.errors['minlength']?.requiredLength}`,
    maxlength: `Maximum length is ${ctrl.errors['maxlength']?.requiredLength}`,
  };

  const errorKey = Object.keys(ctrl.errors)[0];
  return messages[errorKey] ?? '';
}