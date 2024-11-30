# BlueSky - Ratcatcher

This is a fun little hobby project that creates a web interface for adding users to moderation lists instead of having to manually click through a profile, add to list, etc.

For anyone thinking I'm taking away your right to free speech, what the hell ever. You can speak, no one else is required to listen.

## Credentials

This will break unless you add the following to the bluesky.service.ts login() method:

    const credentials = {
        identifier: "youridentifier",
        password: "yourpassword"
    };

I haven't gotten around to putting in a secure way to store identifiers and passwords yet.