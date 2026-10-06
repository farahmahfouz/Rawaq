import { Component, signal } from '@angular/core';
import { IconComponent } from '../../../shared/icons/icon.component';
import { FormComponent } from '../../../shared/components/form/form.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';

type Role = 'student' | 'teacher';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [IconComponent, FormComponent, ButtonComponent, InputComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  selectedRole = signal<Role>('student');

  selectRole(role: Role) {
    this.selectedRole.set(role);
  }
}
