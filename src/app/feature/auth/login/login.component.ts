import { Component, inject, signal } from '@angular/core';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { IconComponent } from '../../../shared/icons/icon.component';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { getControlError } from '../../../core/utils/form.error';
import { LoginRequest } from '../auth';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputComponent, ButtonComponent, IconComponent, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = signal<string>('');
  isLoading = signal(false);

  form = new FormGroup(
    {
      email: new FormControl('farah@gmail.com', [Validators.required, Validators.email]),
      password: new FormControl('Test12345', [Validators.required]),
      rememberMe: new FormControl(false),
    },
  );

  getError(controlName: string): string {
    return getControlError(this.form.get(controlName));
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const rememberMe = this.form.value.rememberMe;

    const body: LoginRequest = {
      email: this.form.value.email!,
      password: this.form.value.password!,
    };

    this.authService.login(body, !!rememberMe).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard'], { replaceUrl: true });
      },
      error: err => {
        this.isLoading.set(false);
        if (err.error?.error_code === 'invalid_credentials') {
          this.errorMessage.set('Invalid email or password');
        }
      },
    })

  }
}
