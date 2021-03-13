import * as React from 'react';
import {deleteItem, doItem, Item} from "./DBParser";

declare const firebase: typeof import('firebase');

type Props = {
    item: Item;
    now: number;
}

const describeAge = (secondsAgo: number): string => {
    // Always in days, for now
    const daysAgo = Math.floor(secondsAgo / 86400);
    if (daysAgo <= 1) return "less than a day ago";
    if (daysAgo === 1) return "a day ago";
    return `${daysAgo} days ago`;
};

const guardedDeleteItem = (item: Item) => {
    const ok = window.confirm(`Delete '${item.name}'?`);
    if (ok) deleteItem(item);
};

export default (props: Props) => {
    const { item } = props;

    return <li key={item.id}>
        {item.name},

        last done:{' '}
        {!item.lastTime && 'never'}
        {item.lastTime && <span title={new Date(item.lastTime).toString()}>
                    {describeAge((props.now - item.lastTime) / 1000)}
                </span>}
        {' '}

        <button onClick={() => doItem(item)}>
            I just did it!
        </button>

        <button onClick={() => guardedDeleteItem(item)}>
            Delete
        </button>
    </li>;
};
