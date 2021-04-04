import * as React from 'react';
import EditableItemList from "./EditableItemList";
import ItemAdder from "./ItemAdder";
import {Item} from "../DBParser";

declare const firebase: typeof import('firebase');

type P = {
    items?: Item[];
    itemsRef: firebase.database.Reference;
}

export default (props: P) => <>
    {props.items && <EditableItemList items={props.items}/>}
    {props.items && <ItemAdder itemsRef={props.itemsRef}/>}
</>;
