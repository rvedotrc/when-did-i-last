import * as React from 'react';
import {useEffect, useState} from "react";
import LoggedIn from "./LoggedIn";
import LoggedOut from "./LoggedOut";

declare const firebase: typeof import('firebase');

export default () => {

    const [currentUser, setCurrentUser] = useState<firebase.User>();

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => setCurrentUser(user || undefined));
    });

    return(currentUser ? <LoggedIn user={currentUser}/> : <LoggedOut/>);
};
