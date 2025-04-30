import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pokemon-profile',
  imports: [DatePipe, RouterLink],
  templateUrl: './pokemon-profile.component.html',
  styleUrl: './pokemon-profile.component.css',
})
export class PokemonProfileComponent {
  readonly #route = inject(ActivatedRoute);
  readonly #pokemonservice = inject(PokemonService);

  readonly #pokemonId = Number(this.#route.snapshot.paramMap.get('id'));

  readonly pokemon = signal(
    this.#pokemonservice.getPokemonById(this.#pokemonId)
  ).asReadonly();
}
