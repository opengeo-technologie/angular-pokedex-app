import { inject, Injectable } from '@angular/core';
import { Pokemon, PokemonList } from '../models/pokemon.model';
import { POKEMON_LIST } from '../data/pokemon-list.fake';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  readonly #POKEMON_API_URL = 'http://localhost:3000/pokemons';
  readonly #http = inject(HttpClient);

  getPokemonList(): Observable<PokemonList> {
    return this.#http.get<PokemonList>(this.#POKEMON_API_URL);
  }

  getPokemonById(id: number): Observable<Pokemon> {
    const url = this.#POKEMON_API_URL + '/' + id;
    return this.#http.get<Pokemon>(url);
  }

  // Met à jour un pokémon existant.
  updatePokemon(pokemon: Pokemon): Observable<Pokemon> {
    return this.#http.put<Pokemon>(
      `${this.#POKEMON_API_URL}/${pokemon.id}`,
      pokemon
    );
  }

  // Supprime un pokémon.
  deletePokemon(pokemonId: number): Observable<void> {
    return this.#http.delete<void>(`${this.#POKEMON_API_URL}/${pokemonId}`);
  }

  // Ajoute un pokémon.
  addPokemon(pokemon: Omit<Pokemon, 'id'>): Observable<Pokemon> {
    return this.#http.post<Pokemon>(this.#POKEMON_API_URL, pokemon);
  }

  getPokemonTypeList(): string[] {
    return [
      'Plante',
      'Feu',
      'Eau',
      'Insecte',
      'Normal',
      'Electrik',
      'Poison',
      'Fée',
      'Vol',
    ];
  }
}
