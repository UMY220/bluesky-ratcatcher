import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { ProfileView } from '@atproto/api/dist/client/types/app/bsky/actor/defs';

import { BlueskyService } from '../../core/services/bluesky.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'bl-review-tab',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule, 
    MatInputModule,
    MatRadioModule,
    MatTableModule
  ],
  templateUrl: './review-tab.component.html',
  styleUrl: './review-tab.component.css'
})
export class ReviewTabComponent {

  @Input()
  userUrl: string = "";

  userForm!: FormGroup;
  // userSearchForm!: FormGroup;
  // userActionForm!: FormGroup;

  actor: string = "Unknown";

  follows: ProfileView[] = [];
  followers: ProfileView[] = [];

  followList:  ProfileView[] = [];

  displayedColumns: string[] = ['did', 'handle', 'displayName', 'description'];

  constructor(private blueskyService: BlueskyService, private formBuilder: FormBuilder) {

    this.userForm = formBuilder.group({
      userUrl: ['', [Validators.required]],
      userDID: ['', [Validators.required]],
      userHandle: ['', [Validators.required]],
    });

    // this.userSearchForm = formBuilder.group({
    //   userUrl: ['', [Validators.required]]
    // });

    // this.userActionForm = formBuilder.group({
    //   userUrl: ['', [Validators.required]],
    //   userHandle: ['', [Validators.required]],
    //   userDID: ['', [Validators.required]],
    // });
    
  }

  async getId() {

    console.log(`clicked getId(), form: ${JSON.stringify(this.userForm.value)}`);
    console.log(`user url: ${JSON.stringify(this.userForm.get("userUrl")?.value || "unknown")}`);

    const userUrl : string | null = this.userForm.get("userUrl")?.value || null;
    if (userUrl) {
      console.log("Attempting to get user handle");
      const handleSubstring = userUrl.lastIndexOf("/") + 1;
      const handle = userUrl.substring(handleSubstring);

      this.actor = (await this.blueskyService.resolveHandle(handle)).data["did"];
      console.log(`DID: ${this.actor}`);

      this.userForm.patchValue({ userUrl: userUrl, userHandle: handle, userDID: this.actor});
      console.log(`User action form: ${JSON.stringify(this.userForm.value)}`);
    }
  }

  async getFollows() : Promise<void> {

    this.followList = [];

    const did : string | null = this.userForm.get("userDID")?.value || null;
    if (did) {
      const response : ProfileView[] = await this.blueskyService.getFollows(did);
      if (response.length) {
        this.followList = response;
      } else {
        this.followList = [];
      }
    }
  }

  async getFollowers() : Promise<void> {

    this.followList = [];

    const did : string | null = this.userForm.get("userDID")?.value || null;
    if (did) {
      const response : ProfileView[] = await this.blueskyService.getFollowers(did);
      if (response.length) {
        this.followList = response;
      } else {
        this.followList = [];
      }
    }
  }

  viewPage() {
    
    const url : string | null = this.userForm.get("userUrl")?.value;
    if (url) {
      window.open(url);
    }
  }
}
