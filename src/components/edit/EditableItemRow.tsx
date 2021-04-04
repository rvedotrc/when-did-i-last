import * as React from 'react';
import {deleteItem, doItem, Item} from "../DBParser";
import {CSSProperties, useState} from "react";
import ItemAdder from "./ItemAdder";

const styles = require('./EditableItemRow.css');

declare const firebase: typeof import('firebase');

type Props = {
    item: Item;
    now: number;
    today: Date;
}

const guardedDeleteItem = (item: Item) => {
    const ok = window.confirm(`Delete '${item.name}'?`);
    if (ok) deleteItem(item);
};

export default (props: Props) => {
    const { item } = props;

    const [isEditing, setIsEditing] = useState<boolean>(false);

    let cssProps: CSSProperties | undefined;

    if (isEditing) {
        return <tr key={item.id}>
            <td colSpan={3}>
                <ItemAdder item={item} onDone={() => setIsEditing(false)}/>
            </td>
        </tr>;
    }

    return <tr key={item.id}>
        <td>
            {item.name}
        </td>

        <td>
            <button onClick={() => setIsEditing(true)} title={"Edit item"}>
                🖊
            </button>
            {' '}
            <button onClick={() => guardedDeleteItem(item)} title={"Delete item"}>
                🗑
            </button>
        </td>
    </tr>;
};
