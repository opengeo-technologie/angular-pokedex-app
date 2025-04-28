import { Component, signal, effect, computed } from '@angular/core';
import { POKEMON_LIST } from './data/pokemon-list.fake';
import { Pokemon } from './models/pokemon.model';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  pokemonList = signal(POKEMON_LIST);

  size(pokemon: Pokemon) {
    if (pokemon.life <= 15) {
      return 'Petit';
    } else if (pokemon.life >= 25) {
      return 'Grand';
    }
    return 'Moyen';
  }

  incrementLife(pokemon: Pokemon) {
    pokemon.life = pokemon.life + 1;
  }

  decrementLife(pokemon: Pokemon) {
    pokemon.life = pokemon.life - 1;
  }
}
