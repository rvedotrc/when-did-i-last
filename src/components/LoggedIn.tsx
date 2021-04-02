import * as React from 'react';
import Items from "./Items";
import {useState} from "react";

declare const firebase: typeof import('firebase');

const signOut = () => firebase.auth().signOut();

type Props = {
    user: firebase.User;
}

export default (props: Props) => {
    const [editMode, setEditMode] = useState<boolean>(false);

    return <>
        <p>
            Signed in as: {props.user.displayName}
            {' '}
            <button onClick={signOut}>
                Sign out
            </button>
            {' '}
            <button onClick={() => setEditMode(!editMode)}
                    title={"Edit mode"}
            >{editMode ? "🔓" : "🔒"}️</button>
        </p>

        <Items user={props.user} editMode={editMode}/>
    </>;
};
