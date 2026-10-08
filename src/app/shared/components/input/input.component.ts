import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { IconComponent } from '../../icons/icon.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

export type InputVariant = 'primary' | 'outlined';

const BASE = `w-full 
  placeholder:text-light-gray 
  text-textTertiary 
  py-3.5
  focus:outline-0 
  rounded-lg`;

const VARIANTS: Record<InputVariant, string> = {
  primary: 'bg-surface-container',
  outlined: 'border border-light-gray bg-[#F9F9FF]',
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
  classes = computed(() => {
    const ps = this.showIcon() ? 'ps-11' : 'ps-3';
    const pe = this.type() === 'password' ? 'pe-11' : 'pe-3';
    return `${BASE} ${ps} ${pe} ${VARIANTS[this.variant()]} font-${this.fontWeight()}`;
  });
  placeholder = input<string>();
  label = input<string>();
  errorMessage = input<string>();
  fontWeight = input<'normal' | 'medium' | 'semibold' | 'bold'>('normal');
  type = input<'text' | 'email' | 'password'>('text');
  showIcon = input(false);
  icon = input<string>('');
  forgot = input(false);

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
