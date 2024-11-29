import { TransformerFn } from "../types/transformer.type";

export interface Follower {
    did: string,
    handle: string,
    displayName: string,
    description: string,
    avatar: string,

}

export const FOLLOWER_TRANSFORMER : TransformerFn<any, Follower | null> = (input: any) => {

    if (!input) {
        return null;
    }

    const result : Follower = {
        did: input.did,
        handle: input.handle,
        displayName: input.displayName,
        description: input.description,
        avatar: input.avatar
    };

    return result;
}