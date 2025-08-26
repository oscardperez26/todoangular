import { Component, computed, effect, signal } from '@angular/core';
import { NgFor } from '@angular/common';  // Import NgFor directive
import { CommonModule } from '@angular/common';
import { Task } from '../models/taks';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [CommonModule, NgFor, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  
  tasks = signal<Task[]>([]);

  filter= signal<'all' | 'pending' | 'completed'>('all');
  taskbyfilter = computed(() => {
    const filter = this.filter();
    const tasks = this.tasks();

    if (filter === 'pending') {
      return tasks.filter(task => !task.completed);
    } else if (filter === 'completed') {
      return tasks.filter(task => task.completed);
    }
    return tasks;
  });

  newinputask = new FormControl('',{
    nonNullable: true,
    validators: [Validators.required]

  });

  taskStatus = new FormControl({
    completed: false
  });


changeHandler() {
  const inputValue = this.newinputask.value.trim();
  if (inputValue && this.newinputask.valid) {
    this.addtask(inputValue);
    this.newinputask.reset();
  }
}

  addtask(title: string) {
    const newTask: Task = {
      id: this.tasks().length + 1,
      title,
      completed: false
    };
    this.tasks.update(tasks => [...tasks, newTask]);
  }

  deletetask(index: number) {
    this.tasks.update(tasks => tasks.filter((_, i) => i !== index));
  }

  taskcompleted(index: number) {
    this.tasks.update(tasks => {
      const task = tasks[index];
      if (task) {
        task.completed = !task.completed;
      }
      return [...tasks];
    });
    console.log(this.tasks());
  }

  editionTask(index: number) {
    this.tasks.update(tasks => {
      const task = tasks[index];
      if (task) {
 
        task.editing = true;
      }
      return [...tasks];
    
    });
  }

  editionTaskupdate(index: number , event: Event) {
    const input = event.target as HTMLInputElement;
    const newTitle = input.value.trim();

    this.tasks.update(tasks => {
      const task = tasks[index];
      if (task && newTitle) {
        task.title = newTitle;
        task.editing = false;
      }
      return [...tasks];
    });
  }

  changefilter(filter:'all' | 'pending' | 'completed'){
    this.filter.set(filter);
  }

  constructor() {
    // Initialize any necessary data or state here
    effect(() => {
      const tasks = this.tasks();
      localStorage.setItem('tasks', JSON.stringify(tasks));
    });
  }

  ngOnInit() {
    const tasks = localStorage.getItem('tasks');
    if (tasks) {
      this.tasks.set(JSON.parse(tasks));
    }
  }
}
