import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-labs',
imports: [CommonModule], // Add CommonModule here
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})
export class LabsComponent {

  title = 'My Todo App';
  todos = ['Buy groceries', 'Clean the house', 'Finish homework'];
  disabled = true;
  name = signal('');
  handleChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.name.set(input.value);
  }
}

