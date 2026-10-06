/* eslint-disable @angular-eslint/component-selector */
import { Component, computed, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'outlined';

const BASE =
  'w-full justify-center inline-flex items-center gap-2 p-4 rounded-lg font-normal cursor-pointer border-2 transition hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-soft';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-primary-dark text-white border-transparent shadow-soft',
  secondary: 'bg-surface-container text-primary border-primary',
  outlined: 'bg-white text-textPrimary border-light-gray',
};

@Component({
  selector: 'button[appButton]',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
  host: {
    '[class]': 'classes()',
  },
})
export class ButtonComponent {
  variant = input<ButtonVariant>('primary');
  classes = computed(() => `${BASE} ${VARIANTS[this.variant()]}`);
}
