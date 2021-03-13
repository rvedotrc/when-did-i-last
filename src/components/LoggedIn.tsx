import * as React from 'react';
import Items from "./Items";

declare const firebase: typeof import('firebase');

const signOut = () => firebase.auth().signOut();

type Props = {
    user: firebase.User;
}

export default (props: Props) => {
    return <>
        <p>Signed in as: {props.user.displayName}</p>

        <button onClick={signOut}>
            Sign out
        </button>

        <Items user={props.user}/>
    </>;
};
