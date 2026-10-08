import { Component, inject, signal } from '@angular/core';
import { IconComponent } from '../../../shared/icons/icon.component';
import { FormComponent } from '../../../shared/components/form/form.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { isMatchPw } from '../../../core/utils/password.validator';
import { getControlError } from '../../../core/utils/form.error';
import { Role, SignupRequest } from '../auth';
import { AuthService } from '../auth.service';
import { UploadFileService } from '../../../core/services/upload-file.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [IconComponent, FormComponent, ButtonComponent, InputComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  private authService = inject(AuthService);
  private uploadFileService = inject(UploadFileService);
  private router = inject(Router);

  selectedRole = signal<Role>('student');
  selectedAvatar = signal<File | null>(null);
  avatarError = signal('');

  isLoading = signal(false);
  errorMessage = signal('');

  form = new FormGroup(
    {
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirm_password: new FormControl('', [Validators.required]),
      account_type: new FormControl('student', [Validators.required]),
    },
    { validators: isMatchPw }
  );

  selectRole(role: Role) {
    this.selectedRole.set(role);
    this.form.controls.account_type.setValue(role);
  }

  getError(controlName: string): string {
    if (controlName === 'confirm_password' && this.form.hasError('notMatch')) {
      const confirmControl = this.form.get('confirm_password');
      if (confirmControl?.touched || confirmControl?.dirty) {
        return 'Passwords do not match';
      }
      return getControlError(confirmControl);
    }
    return getControlError(this.form.get(controlName));
  }

  onAvatarSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    this.avatarError.set('');

    if (!file) {
      this.selectedAvatar.set(null);
      return;
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];

    if (!allowedTypes.includes(file.type)) {
      this.avatarError.set('Only JPG, PNG, and WebP images are allowed.');
      input.value = '';
      return;
    }

    const maxSize = 500 * 1024;

    if (file.size > maxSize) {
      this.avatarError.set('Image size must not exceed 500 KB.');
      input.value = '';
      return;
    }

    this.selectedAvatar.set(file);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const file = this.selectedAvatar();

    if (file) {
      this.uploadFileService.uploadAvatar(file).subscribe({
        next: (response) => {
          const fileName = response.Key.split('/').pop()!;

          const avatarUrl = this.uploadFileService.getAvatarUrl(fileName);

          this.createAccount(avatarUrl);
        },
        error: (error) => {
          console.error('AVATAR UPLOAD ERROR:', error);
          this.isLoading.set(false);
          this.avatarError.set('Failed to upload avatar.');
        }
      });

      return;
    }

    this.createAccount();
  }

  private createAccount(avatarUrl?: string) {
    const body: SignupRequest = {
      email: this.form.value.email!,
      password: this.form.value.password!,

      data: {
        first_name: this.form.value.first_name!,
        last_name: this.form.value.last_name!,
        account_type: this.form.value.account_type! as Role,
        ...(avatarUrl && { avatar_url: avatarUrl })
      }
    };

    this.authService.signUp(body).subscribe({
      next: (response) => {
        this.router.navigate(['/dashboard'], { replaceUrl: true });
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          error?.error?.msg ?? 'Something went wrong, Please try again later!'
        );
      }
    });
  }
}
