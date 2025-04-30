import { Component, inject, Input, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pokemon-edit',
  imports: [RouterLink, FormsModule],
  templateUrl: './pokemon-edit.component.html',
  styleUrl: './pokemon-edit.component.css',
})
export class PokemonEditComponent {
  @Input() life: number = 1;
  @Input() damage: number = 1;
  @Input() name: string = '';
  @Input() min: number = 1;
  @Input() max: number = 30;
  readonly #route = inject(ActivatedRoute);
  readonly #pokemonservice = inject(PokemonService);

  readonly #pokemonId = Number(this.#route.snapshot.paramMap.get('id'));

  readonly pokemon = signal(
    this.#pokemonservice.getPokemonById(this.#pokemonId)
  ).asReadonly();

  readonly pokemonTypes = signal(this.#pokemonservice.getPokemonTypeList());

  incrementLife() {
    if (this.life < this.max) this.life++;
  }

  decrementLife() {
    if (this.life > this.min) this.life--;
  }

  incrementDamage() {
    if (this.damage < this.max) this.damage++;
  }

  decrementDamage() {
    if (this.damage > this.min) this.damage--;
  }
}
