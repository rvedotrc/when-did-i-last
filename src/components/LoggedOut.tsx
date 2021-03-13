import * as React from 'react';

declare const firebase: typeof import('firebase');

const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
};

export default () => {
    return <>
        <h1>When Did I Last...?</h1>

        <p>
            Do you constantly forget to do things that you know are important?
            Like, you know that it's a good thing if you talk to your friend
            once in a while, but before you know it, suddenly it's been 6 months,
            and you... just completely lost track of how long it had been?
        </p>

        <p>
            Or maybe the same thing but for chores: change the bed. Vacuum. Empty
            the fridge.
        </p>

        <p>
            Or for activities: go for a walk. Play your guitar. Go to the park.
        </p>

        <p>
            <em>When Did I Last...?</em> help you record when you
            last did <em>X</em>, for whatever <em>X</em> you want to track.
        </p>

        <p>
            It uses Google to store your list of tasks.
            Sign in with Google to get started.
        </p>

        <button onClick={signInWithGoogle}>
            Sign in with Google
        </button>
    </>;
};
