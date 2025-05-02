import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { DatePipe } from '@angular/common';
import { getPokemonColor } from '../../models/pokemon.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, catchError, of } from 'rxjs';

@Component({
  selector: 'app-pokemon-profile',
  imports: [DatePipe, RouterLink],
  templateUrl: './pokemon-profile.component.html',
  styleUrl: './pokemon-profile.component.css',
})
export class PokemonProfileComponent {
  readonly #route = inject(ActivatedRoute);
  readonly #pokemonService = inject(PokemonService);

  readonly #pokemonId = Number(this.#route.snapshot.paramMap.get('id'));

  private readonly pokemonResponse = toSignal(
    this.#pokemonService.getPokemonById(this.#pokemonId).pipe(
      map((value) => ({ value, error: undefined })),
      catchError((error) => of({ value: undefined, error }))
    )
  );
  // readonly pokemon = toSignal(
  //   this.#pokemonService.getPokemonById(this.#pokemonId)
  // );

  readonly pokemon = computed(() => this.pokemonResponse()?.value);
  readonly loading = computed(() => !this.pokemonResponse());
  readonly error = computed(() => this.pokemonResponse()?.error);

  getPokemonColor(type: string) {
    return getPokemonColor(type) + ' !important';
  }
}
