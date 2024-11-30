import { DestroyRef, Injectable } from '@angular/core';
import { AtUri, BskyAgent } from '@atproto/api';
import { ProfileView } from '@atproto/api/dist/client/types/app/bsky/actor/defs';
import { ListView } from '@atproto/api/dist/client/types/app/bsky/graph/defs';


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



    console.log(JSON.stringify(credentials));

    await this.agent.login(credentials);
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

   async getFollows(did: string): Promise<ProfileView[]> {

    let result : ProfileView[] = [];
    let cursor : string | undefined;

    do {
      const params = {
        actor: did,
        limit: 100,
        cursor
      };
      const response = await this.agent.getFollows(params);
      const follows : ProfileView[] = response.data?.follows || [];
      result = result.concat(follows);
      cursor = response.data.cursor;

    } while (cursor);

    return result;
   }

   async getFollowers(did: string) : Promise<ProfileView[]> {

    let result : ProfileView[] = [];
    let cursor : string | undefined;
    do {
      const params = {
        actor: did,
        limit: 100,
        cursor
      };
      const response = await this.agent.getFollowers(params);
      const followers : ProfileView[] = response.data?.followers || [];
      result = result.concat(followers);
      cursor = response.data.cursor;

    } while (cursor);

    return result;
   }

   async getModLists(did: string) {

    let result : ListView[] = [];
    let cursor : string | undefined;
    do {
      const params = {
        actor: did,
        cursor
      };

      const response = await this.agent.app.bsky.graph.getLists(params);
      let lists : ListView[] = response.data.lists || [];
      if (lists.length) {
        lists = lists.filter((list) => list.purpose === "app.bsky.graph.defs#modlist");
      }
      result = result.concat(lists);
      cursor = response.data.cursor;
    } while (cursor);

    return result;
   }

   async createModList(name: string, description: string) {

    const did : string | undefined = this.agent.session?.did;
    if (did) {
      const record = {
        repo: did,
        collection: 'app.bsky.graph.list',
        record: {
          $type: 'app.bsky.graph.list',
          purpose: "app.bsky.graph.defs#modlist",
          name: name,
          description: description,
          createdAt: new Date().toISOString()
        }
      };
  
      await this.agent.com.atproto.repo.createRecord(record);
    }


   }

   async deleteModList(listUri: string) {

    // repo isn't being populated by AtUrl so I'm not dealing with this right now
    // const {repo, collection, rkey} = new AtUri(listUri)
    // await this.agent.com.atproto.repo.deleteRecord({repo, collection, rkey})
   }
}
