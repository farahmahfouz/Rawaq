import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { IconComponent } from '../../icons/icon.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

export type InputVariant = 'primary' | 'outlined';

const BASE = `w-full text-light-gray font-normal py-3.5 px-3 focus:outline-0 rounded-lg`;

const VARIANTS: Record<InputVariant, string> = {
  primary: 'bg-surface-container',
  outlined: 'bg-transparent border border-light-gray',
};

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent {
  variant = input<InputVariant>('primary');
  classes = computed(() => `${BASE} ${VARIANTS[this.variant()]}`);
  placeholder = input<string>();
  label = input<string>();
  errorMessage = input<string>();
  type = input<'text' | 'email' | 'password'>('text');

  visible = signal(false);
  value = signal('');
  disabled = signal(false);

  inputType = computed(() =>
    this.type() === 'password' && this.visible() ? 'text' : this.type()
  );

  toggle() {
    this.visible.update(v => !v);
  }

  onChange = (_: string) => { };

  onTouched = () => { };

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  updateValue(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.value.set(value);
    this.onChange(value);
  }

}
