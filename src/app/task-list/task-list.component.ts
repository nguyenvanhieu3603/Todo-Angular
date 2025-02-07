import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  newTask: Task = this.createEmptyTask();
  editingTask: Task | null = null;
  filter: 'all' | 'active' | 'completed' = 'all';

  ngOnInit(): void {
    this.loadTasks();
  }

  // Tạo task trống
  private createEmptyTask(): Task {
    return {
      id: 0,
      title: '',
      completed: false,
      createdAt: new Date(),
      dueDate: null
    };
  }

  // Lưu tasks vào localStorage
  private saveTasks(): void {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  // Tải tasks từ localStorage
  private loadTasks(): void {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks).map((task: Task) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        completedAt: task.completedAt ? new Date(task.completedAt) : null
      }));
    }
  }

  // Thêm task mới
  addTask(): void {
    if (this.newTask.title.trim()) {
      const task: Task = {
        id: Date.now(),
        title: this.newTask.title,
        completed: false,
        createdAt: new Date(),
        dueDate: this.newTask.dueDate ? new Date(this.newTask.dueDate) : null
      };

      this.tasks.push(task);
      this.newTask = this.createEmptyTask();
      this.saveTasks();
    }
  }

  // Chỉnh sửa task
  startEditing(task: Task): void {
    this.editingTask = { ...task };
  }

  saveEdit(): void {
    if (this.editingTask) {
      const index = this.tasks.findIndex(t => t.id === this.editingTask!.id);
      if (index !== -1) {
        this.tasks[index] = { ...this.editingTask };
        this.editingTask = null;
        this.saveTasks();
      }
    }
  }

  cancelEdit(): void {
    this.editingTask = null;
  }

  // Chuyển đổi trạng thái task
  toggleTaskCompletion(task: Task): void {
    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date() : null;
    this.saveTasks();
  }

  // Xóa task
  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.saveTasks();
  }

  // Lọc tasks
  getFilteredTasks(): Task[] {
    switch (this.filter) {
      case 'active':
        return this.tasks.filter(task => !task.completed);
      case 'completed':
        return this.tasks.filter(task => task.completed);
      default:
        return this.tasks;
    }
  }

  // Đếm tasks còn lại
  getRemainingTaskCount(): number {
    return this.tasks.filter(task => !task.completed).length;
  }

  // Tính ngày còn lại
  getDaysRemaining(task: Task): number | null {
    if (!task.dueDate) return null;
    
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const timeDiff = dueDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return daysDiff > 0 ? daysDiff : 0;
  }

  // Kiểm tra task quá hạn
  isTaskOverdue(task: Task): boolean {
    if (!task.dueDate || task.completed) return false;
    
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return today > dueDate;
  }
}
