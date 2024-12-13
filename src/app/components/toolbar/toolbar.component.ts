import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ThemeToggleComponent } from "../../shared/components/theme-toggle/theme-toggle.component";
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-toolbar',
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, RouterModule, MatDividerModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {}
