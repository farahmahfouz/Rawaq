import { Component, computed, input, signal } from '@angular/core';
import { IconComponent } from '../../icons/icon.component';

export type InputVariant = 'primary' | 'outlined';

const BASE = `w-full text-light-gray font-normal py-3.5 px-3 focus:outline-0 rounded-lg`;

const VARIANTS: Record<InputVariant, string> = {
  primary: 'bg-surface-container',
  outlined: 'bg-transparent border-light-gray',
};

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
})
export class InputComponent {
  variant = input<InputVariant>('primary');
  classes = computed(() => `${BASE} ${VARIANTS[this.variant()]}`);
  placeholder = input<string>();
  label = input<string>();
  errorMessage = input<string>();
  type = input<'text' | 'email' | 'password'>('text');

  visible = signal(false);

  inputType = computed(() =>
    this.type() === 'password' && this.visible() ? 'text' : this.type()
  );

  toggle() {
    this.visible.update(v => !v);
  }

}
