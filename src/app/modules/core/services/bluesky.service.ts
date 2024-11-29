import { DestroyRef, Injectable } from '@angular/core';
import { BskyAgent } from '@atproto/api';
import { ProfileView } from '@atproto/api/dist/client/types/app/bsky/actor/defs';


@Injectable({
  providedIn: 'root'
})
export class BlueskyService {

  private agent : BskyAgent;

  constructor(private destroyRef : DestroyRef) {

    this.agent = new BskyAgent({
      service: 'https://bsky.social'
    });

    this.login();

    this.destroyRef.onDestroy(() => {
      this.logout();
    });
   }

   async login() {
    await this.agent.login({
      identifier: 'dartmanx.bsky.social',
      password: 'lBwScfKg^Zk6'
    });
   }

   async logout() {
    await this.agent.logout();
   }

   resolveHandle(actor: string) {

    const params = {
      handle: actor
    };

    const result = this.agent.resolveHandle(params);
    return result;
   }

   async getFollowers(did: string) : Promise<ProfileView[]> {

    let result : ProfileView[] = [];

    let params = {
      actor :  did,
      limit: 100,

    };

    let cursor : string | undefined;
    do {
      const params = {
        actor: did,
        cursor
      };
      const response = await this.agent.getFollowers(params);
      const followers : ProfileView[] = response.data?.followers || [];
      result = result.concat(followers);
      cursor = response.data.cursor;

    } while (cursor);

    return result;
   }
}
