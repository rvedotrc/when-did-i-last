import * as React from 'react';
import {useState} from "react";
import ItemsProvider from "./ItemsProvider";
import Edit from "./edit";
import Main from "./main/ItemList";

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

        <ItemsProvider user={props.user} r={(inner) =>
            <>
                {!inner.items && <p>loading...</p>}
                {inner.items && editMode && <Edit itemsRef={inner.itemsRef} items={inner.items}/>}
                {inner.items && !editMode && <Main items={inner.items}/>}
            </>
        }/>
    </>;
};
