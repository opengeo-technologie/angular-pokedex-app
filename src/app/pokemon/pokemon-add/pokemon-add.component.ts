import { Component, inject, signal } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  POKEMON_RULES,
  Pokemon,
  getPokemonColor,
} from '../../models/pokemon.model';
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-add',
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './pokemon-add.component.html',
  styleUrl: './pokemon-add.component.css',
})
export class PokemonAddComponent {
  readonly router = inject(Router);
  readonly pokemonService = inject(PokemonService);
  readonly POKEMON_RULES = signal(POKEMON_RULES).asReadonly();
  readonly form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(POKEMON_RULES.MIN_NAME),
      Validators.maxLength(POKEMON_RULES.MAX_NAME),
      Validators.pattern(POKEMON_RULES.NAME_PATTERN),
    ]),
    picture: new FormControl('', [Validators.required]),
    life: new FormControl(10),
    damage: new FormControl(1),
    types: new FormArray(
      [new FormControl('Normal')],
      [Validators.required, Validators.maxLength(3)]
    ),
  });

  onSubmit() {
    Object.values(this.form.controls).forEach((control) =>
      control.markAsDirty()
    );

    if (this.form.invalid) {
      return;
    }

    const pokemon: Omit<Pokemon, 'id'> = {
      name: this.pokemonName.value,
      picture: this.pokemonPicture.value,
      life: this.pokemonLife.value,
      damage: this.pokemonDamage.value,
      types: this.pokemonTypeList.controls.map((control) => control.value) as [
        string,
        string?,
        string?
      ],
      created: new Date(),
    };

    this.pokemonService.addPokemon(pokemon).subscribe((pokemonAdded) => {
      this.router.navigate(['/pokemons', pokemonAdded.id]);
    });
  }

  get pokemonPicture() {
    return this.form.get('picture') as FormControl;
  }

  get pokemonName() {
    return this.form.get('name') as FormControl;
  }

  get pokemonLife() {
    return this.form.get('life') as FormControl;
  }

  get pokemonDamage() {
    return this.form.get('damage') as FormControl;
  }

  get pokemonTypeList() {
    return this.form.get('types') as FormArray;
  }

  getPokemonColor(type: string) {
    return getPokemonColor(type) + ' !important';
  }

  incrementLife() {
    const current = this.form.get('life')?.value || 0;
    if (current < POKEMON_RULES.MAX_LIFE)
      this.form.get('life')?.setValue(current + 1);
  }

  decrementLife() {
    const current = this.form.get('life')?.value || 0;
    if (current > POKEMON_RULES.MIN_LIFE)
      this.form.get('life')?.setValue(current - 1);
  }

  incrementDamage() {
    const current = this.form.get('damage')?.value || 0;
    if (current < POKEMON_RULES.MAX_DAMAGE)
      this.form.get('damage')?.setValue(current + 1);
  }

  decrementDamage() {
    const current = this.form.get('damage')?.value || 0;
    if (current > POKEMON_RULES.MIN_DAMAGE)
      this.form.get('damage')?.setValue(current - 1);
  }

  isPokemonTypeSelected(type: string) {
    return !!this.pokemonTypeList.controls.find(
      (control) => control.value === type
    );
  }

  onPokemonTypeChange(type: string, isChecked: boolean) {
    if (isChecked) {
      // Add control
      const control = new FormControl(type);
      this.pokemonTypeList.push(control);
    } else {
      // Remove control
      const index = this.pokemonTypeList.controls
        .map((control) => control.value)
        .indexOf(type);
      this.pokemonTypeList.removeAt(index);
    }
  }
}
