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

    return <div>
        {!currentUser && <>
            <h1>Hello!</h1>

            <p><i>When Did I Last...?</i> uses Google to store your list of tasks.</p>
            <p>Sign in with Google to get started.</p>

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
