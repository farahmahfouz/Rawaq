import { Component, signal } from '@angular/core';
import { IconComponent } from '../../../shared/icons/icon.component';
import { FormComponent } from '../../../shared/components/form/form.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { isMatchPw } from '../../../core/utils/password.validator';
import { getControlError } from '../../../core/utils/form.error';

type Role = 'student' | 'teacher';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [IconComponent, FormComponent, ButtonComponent, InputComponent, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  selectedRole = signal<Role>('student');

  form = new FormGroup(
    {
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirm_password: new FormControl('', [Validators.required]),
      account_type: new FormControl('', [Validators.required]),
      avatar_url: new FormControl(''),
    },
    { validators: isMatchPw }
  );

  selectRole(role: Role) {
    this.selectedRole.set(role);
    this.form.controls.account_type.setValue(role);
  }

  getError(controlName: string): string {
    if (controlName === 'confirmPassword' && this.form.hasError('notMatch')) {
      const confirmControl = this.form.get('confirmPassword');
      if (confirmControl?.touched || confirmControl?.dirty) {
        return 'Passwords do not match';
      }
      return getControlError(confirmControl);
    }
    return getControlError(this.form.get(controlName));
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  }
}
