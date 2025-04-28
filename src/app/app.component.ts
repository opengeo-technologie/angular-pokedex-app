import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  name = signal('Pikachu');
  life = signal(21);

  incrementLife() {
    this.life.update((life) => life + 1);
  }

  decrementLife() {
    this.life.update((life) => life - 1);
  }
}
