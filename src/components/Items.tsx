import * as React from 'react';
import {useEffect, useState} from "react";
import ItemAdder from "./ItemAdder";
import ItemList from "./ItemList";
import {Item, parseItems} from "./DBParser";

declare const firebase: typeof import('firebase');

type Props = {
    user: firebase.User;
}

export default (props: Props) => {
    const [items, setItems] = useState<Item[]>();
    const [editMode, setEditMode] = useState<boolean>(false);

    const itemsRef = firebase.database().ref(`/users/${props.user.uid}/items`);

    const listener = (snapshot: firebase.database.DataSnapshot) =>
        setItems(parseItems(snapshot.ref, snapshot.val()))

    useEffect(
        () => {
            itemsRef.on("value", listener);
            return () => itemsRef.off("value", listener);
        },
        [props.user.uid]
    );

    if (!items) return null;

    return <div>
        <ItemList user={props.user} items={items} editMode={editMode}/>

        <button onClick={() => setEditMode(!editMode)}
                title={"Edit mode"}
                >{editMode ? "🔓" : "🔒"}️</button>

        {(editMode || (items.length === 0)) && <ItemAdder user={props.user} itemsRef={itemsRef}/>}
    </div>;
};
