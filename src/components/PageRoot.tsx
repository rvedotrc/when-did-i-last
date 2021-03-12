import * as React from 'react';
import {useEffect, useState} from "react";
import Items from "./Items";

declare const firebase: typeof import('firebase');

export default () => {

    const [currentUser, setCurrentUser] = useState<firebase.User>();

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => setCurrentUser(user || undefined));
    });

    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider);
    };

    const signOut = () => firebase.auth().signOut();

    console.log({ currentUser });

    return <div>
        {/*<h2>currentUser</h2>*/}
        {/*<pre>{JSON.stringify(currentUser, null, 2)}</pre>*/}

        {!currentUser && <>
            <h1>Hello!</h1>

            <button onClick={signInWithGoogle}>
                Sign in with Google
            </button>
        </>}

        {currentUser && <>
            <h1>Hello {currentUser.displayName}!</h1>

            <button onClick={signOut}>
                Sign out
            </button>

            <Items user={currentUser}/>
        </>}

    </div>;
};
