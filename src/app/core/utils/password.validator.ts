import { AbstractControl, ValidationErrors } from "@angular/forms";


export function isMatchPw(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirm_password')?.value;
  return password === confirmPassword ? null : { notMatch: true };
}