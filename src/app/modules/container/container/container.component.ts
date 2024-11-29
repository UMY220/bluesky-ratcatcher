import { Component } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { ReviewTabComponent } from "../../review/review-tab/review-tab.component";
import { ImportTabComponent } from "../../import/import-tab/import-tab.component";
import { AdminTabComponent } from "../../admin/admin-tab/admin-tab.component";

@Component({
  selector: 'bl-container',
  standalone: true,
  imports: [
    MatTabsModule,
    ReviewTabComponent,
    ImportTabComponent,
    AdminTabComponent
],
  templateUrl: './container.component.html',
  styleUrl: './container.component.css'
})
export class ContainerComponent {

}
