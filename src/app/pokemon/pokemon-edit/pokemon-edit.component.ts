import { Component, inject, Input, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { getPokemonColor } from '../../models/pokemon.model';
import {
  FormArray,
  FormControl,
  ReactiveFormsModule,
  FormGroup,
  FormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-pokemon-edit',
  imports: [RouterLink, FormsModule, ReactiveFormsModule],
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

  readonly form = new FormGroup({
    name: new FormControl(this.pokemon().name),
    life: new FormControl(this.pokemon().life),
    damage: new FormControl(this.pokemon().damage),
    types: new FormArray(
      this.pokemon().types.map((type) => new FormControl(type))
    ),
  });

  get pokemonTypeList(): FormArray {
    return this.form.get('types') as FormArray;
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
    return getPokemonColor(type);
  }

  incrementLife() {
    const current = this.form.get('life')?.value || 0;
    if (current < this.max) this.form.get('life')?.setValue(current + 1);
  }

  decrementLife() {
    const current = this.form.get('life')?.value || 0;
    if (current > this.min) this.form.get('life')?.setValue(current - 1);
  }

  incrementDamage() {
    const current = this.form.get('damage')?.value || 0;
    if (current < this.max) this.form.get('damage')?.setValue(current + 1);
  }

  decrementDamage() {
    const current = this.form.get('damage')?.value || 0;
    if (current > this.min) this.form.get('damage')?.setValue(current - 1);
  }

  onSubmit() {
    console.log(this.form.value);
  }
}
