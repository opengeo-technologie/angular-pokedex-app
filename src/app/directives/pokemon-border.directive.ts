import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
  AfterViewInit,
} from '@angular/core';
import { getPokemonColor } from '../models/pokemon.model';

@Directive({
  selector: '[appPokemonBorder]',
})
export class PokemonBorderDirective implements AfterViewInit {
  @Input('appPokemonBorder') pokemonType: string = ''; // accept string directly from input
  private initialColor: string = '#ffffff';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    // Ensure there's a visible border
    this.renderer.setStyle(this.el.nativeElement, 'borderWidth', '2px');
    this.renderer.setStyle(this.el.nativeElement, 'borderStyle', 'solid');

    // Capture current border color (after view init)
    const computedStyle = getComputedStyle(this.el.nativeElement);
    // this.initialColor = computedStyle.borderColor || '#303030';

    this.renderer.setStyle(
      this.el.nativeElement,
      'borderColor',
      this.initialColor
    );
  }

  @HostListener('mouseenter') onMouseEnter() {
    const color = getPokemonColor(this.pokemonType);
    this.setBorder(color);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.setBorder(this.initialColor);
  }

  private setBorder(color: string) {
    this.renderer.setStyle(this.el.nativeElement, 'borderColor', color);
  }
}
