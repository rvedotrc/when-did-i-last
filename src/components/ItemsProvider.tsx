import * as React from 'react';
import {ComponentType, useEffect, useState} from "react";
import {Item, parseItems} from "./DBParser";

declare const firebase: typeof import('firebase');

type Props = {
    user: firebase.User;
    r: ComponentType<{
        itemsRef: firebase.database.Reference;
        items?: Item[];
    }>;
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

    return React.createElement(props.r, { itemsRef, items })
};
