import * as React from 'react';
import {useEffect, useState} from "react";
import ItemAdder from "./ItemAdder";
import ItemList from "./ItemList";
import {Item, parseItems} from "./DBParser";

declare const firebase: typeof import('firebase');

type Props = {
    user: firebase.User;
    editMode: boolean;
}

export default (props: Props) => {
    const [items, setItems] = useState<Item[]>();

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
        <ItemList items={items} editMode={props.editMode}/>

        {(props.editMode || (items.length === 0)) && <ItemAdder itemsRef={itemsRef}/>}
    </div>;
};
