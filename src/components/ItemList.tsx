import * as React from "react";
import {deleteItem, doItem, Item} from "./DBParser";

declare const firebase: typeof import('firebase');

type Props = {
    user: firebase.User;
    items: Item[];
}

export default (props: Props) => {
    const guardedDeleteItem = (item: Item) => {
        const ok = window.confirm(`Delete '${item.name}'?`);
        if (ok) deleteItem(item);
    };

    return <div>
        <h2>Items</h2>
        <ol>
            {props.items.map((item, index) => <li key={item.id}>
                {item.name}, last done: never {item.lastTime}
                <button onClick={() => doItem(item)}>
                    I just did it!
                </button>
                <button onClick={() => guardedDeleteItem(item)}>
                    Delete
                </button>
            </li>)}
        </ol>
    </div>;
};


