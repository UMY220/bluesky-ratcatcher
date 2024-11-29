import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'bl-admin-tab',
  standalone: true,
  imports: [
    MatButtonModule
  ],
  templateUrl: './admin-tab.component.html',
  styleUrl: './admin-tab.component.css'
})
export class AdminTabComponent {

}
