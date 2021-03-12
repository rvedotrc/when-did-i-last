import * as React from "react";
import {deleteItem, doItem, Item} from "./DBParser";

declare const firebase: typeof import('firebase');

type Props = {
    user: firebase.User;
    items: Item[];
}

const describeAge = (secondsAgo: number): string => {
    // Always in days, for now
    const daysAgo = Math.floor(secondsAgo / 86400);
    if (daysAgo <= 1) return "less than a day ago";
    if (daysAgo === 1) return "a day ago";
    return `${daysAgo} days ago`;
};

export default (props: Props) => {
    const guardedDeleteItem = (item: Item) => {
        const ok = window.confirm(`Delete '${item.name}'?`);
        if (ok) deleteItem(item);
    };

    // Auto-re-render every hour or so?
    const now = new Date().getTime();

    return <div>
        <h2>Items</h2>
        <ol>
            {props.items.map((item, index) => <li key={item.id}>
                {item.name},

                last done:{' '}
                {!item.lastTime && 'never'}
                {item.lastTime && <span title={new Date(item.lastTime).toString()}>
                    {describeAge((now - item.lastTime) / 1000)}
                </span>}
                {' '}

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

