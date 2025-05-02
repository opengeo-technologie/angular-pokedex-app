import {
  Component,
  computed,
  effect,
  inject,
  Input,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import {
  getPokemonColor,
  Pokemon,
  POKEMON_RULES,
} from '../../models/pokemon.model';
import {
  FormArray,
  FormControl,
  ReactiveFormsModule,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, catchError, of } from 'rxjs';

@Component({
  selector: 'app-pokemon-edit',
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './pokemon-edit.component.html',
  styleUrl: './pokemon-edit.component.css',
})
export class PokemonEditComponent {
  readonly #route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly #pokemonservice = inject(PokemonService);

  readonly #pokemonId = Number(this.#route.snapshot.paramMap.get('id'));

  private readonly pokemonResponse = toSignal(
    this.#pokemonservice.getPokemonById(this.#pokemonId).pipe(
      map((value) => ({ value, error: undefined })),
      catchError((error) => of({ value: undefined, error }))
    )
  );

  readonly pokemon = computed(() => this.pokemonResponse()?.value);
  readonly loading = computed(() => !this.pokemonResponse());
  readonly error = computed(() => this.pokemonResponse()?.error);

  readonly pokemonTypes = signal(this.#pokemonservice.getPokemonTypeList());

  readonly form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(POKEMON_RULES.MIN_NAME),
      Validators.maxLength(POKEMON_RULES.MAX_NAME),
      Validators.pattern(POKEMON_RULES.NAME_PATTERN),
    ]),
    life: new FormControl(),
    damage: new FormControl(),
    types: new FormArray(
      [],
      [Validators.required, Validators.maxLength(POKEMON_RULES.MAX_TYPES)]
    ),
  });

  constructor() {
    effect(() => {
      const pokemon = this.pokemon();

      if (pokemon) {
        this.form.patchValue({
          name: pokemon.name,
          life: pokemon.life,
          damage: pokemon.damage,
        });

        pokemon.types.forEach((type) =>
          this.pokemonTypeList.push(new FormControl(type))
        );
      }
    });
  }

  get pokemonTypeList(): FormArray {
    return this.form.get('types') as FormArray;
  }

  get pokemonName(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get pokemonLife(): FormControl {
    return this.form.get('life') as FormControl;
  }

  get pokemonDamage() {
    return this.form.get('damage') as FormControl;
  }

  isPokemonTypeSelected(type: string): boolean {
    return !!this.pokemonTypeList.controls.find(
      (control) => control.value == type
    );
  }

  onPokemonTypeChange(type: string, isChecked: boolean) {
    if (isChecked) {
      const control = new FormControl(type);
      this.pokemonTypeList.push(control);
    } else {
      const index = this.pokemonTypeList.controls
        .map((control) => control.value)
        .indexOf(type);

      this.pokemonTypeList.removeAt(index);
    }
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

  onSubmit() {
    const isFormValid = this.form.valid;
    const pokemon = this.pokemon();

    if (isFormValid && pokemon) {
      const updatedPokemon: Pokemon = {
        ...pokemon,
        name: this.pokemonName.value as string,
        life: this.pokemonLife.value,
        damage: this.pokemonDamage.value,
        types: this.pokemonTypeList.value,
      };

      this.#pokemonservice.updatePokemon(updatedPokemon).subscribe(() => {
        this.router.navigate(['/pokemons', this.#pokemonId]);
      });
    }
  }
}
