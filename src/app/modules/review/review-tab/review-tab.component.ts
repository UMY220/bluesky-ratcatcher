import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';

import { BlueskyService } from '../../core/services/bluesky.service';
import { Follower, FOLLOWER_TRANSFORMER } from '../../core/interfaces/follower.interface';
import { ProfileView } from '@atproto/api/dist/client/types/app/bsky/actor/defs';

@Component({
  selector: 'bl-review-tab',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule, 
    MatInputModule,
    MatTableModule
  ],
  templateUrl: './review-tab.component.html',
  styleUrl: './review-tab.component.css'
})
export class ReviewTabComponent {

  @Input()
  userUrl: string = "";

  userSearchForm!: FormGroup;
  userActionForm!: FormGroup;

  actor: string = "Unknown";

  followers: ProfileView[] = [];
  displayedColumns: string[] = ['did', 'handle', 'displayName'];

  constructor(private blueskyService: BlueskyService, private formBuilder: FormBuilder) {

    this.userSearchForm = formBuilder.group({
      userUrl: ['', [Validators.required]]
    });

    this.userActionForm = formBuilder.group({
      userUrl: ['', [Validators.required]],
      userHandle: ['', [Validators.required]],
      userDID: ['', [Validators.required]],
    });
    
  }

  async getId() {

    console.log(`clicked getId(), form: ${JSON.stringify(this.userSearchForm.value)}`);
    console.log(`user url: ${JSON.stringify(this.userSearchForm.get("userUrl")?.value || "unknown")}`);

    const userUrl : string | null = this.userSearchForm.get("userUrl")?.value || null;
    if (userUrl) {
      console.log("Attempting to get user handle");
      const handleSubstring = userUrl.lastIndexOf("/") + 1;
      const handle = userUrl.substring(handleSubstring);

      this.actor = (await this.blueskyService.resolveHandle(handle)).data["did"];
      console.log(`DID: ${this.actor}`);

      this.userActionForm.patchValue({ userUrl: userUrl, userHandle: handle, userDID: this.actor});
      console.log(`User action form: ${JSON.stringify(this.userActionForm.value)}`);
    }
  }

  async getFollowers() : Promise<void> {

    const did : string | null = this.userActionForm.get("userDID")?.value || null;
    if (did) {
      const response : ProfileView[] = await this.blueskyService.getFollowers(did);
      if (response.length) {
        this.followers = response;
      } else {
        this.followers = [];
      }
      console.log(`Total followers: ${this.followers.length}`);
      //console.log(`Followers: ${JSON.stringify(this.followers, null, 4)}`);
    }
  }

  viewPage() {
    
    const url : string | null = this.userActionForm.get("userUrl")?.value;
    if (url) {
      window.open(url);
    }
  }
}