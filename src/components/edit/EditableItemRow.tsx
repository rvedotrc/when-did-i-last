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

const describeWhen = (today: Date, lastTime: number): string => {
    // Always in days, for now

    const dayDone = new Date(lastTime);
    dayDone.setHours(0);
    dayDone.setMinutes(0);
    dayDone.setSeconds(0);
    dayDone.setMilliseconds(0);

    const daysAgo = (today.getTime() - dayDone.getTime()) / 86400 / 1000;
    console.log({
        lastTime: {
            n: lastTime,
            d: new Date(lastTime),
        },
        dayDone: {
            n: dayDone.getTime(),
            d: dayDone,
        },
        daysAgo,
    });

    if (daysAgo < 1) return "today";
    if (daysAgo === 1) return "yesterday";
    return `${Math.round(daysAgo)} days ago`;
};

const guardedDoItem = (item: Item) => {
    const ok = window.confirm(`Mark '${item.name}' as just done?`);
    if (ok) doItem(item);
};

const guardedDeleteItem = (item: Item) => {
    const ok = window.confirm(`Delete '${item.name}'?`);
    if (ok) deleteItem(item);
};

export default (props: Props) => {
    const { item } = props;

    const [isEditing, setIsEditing] = useState<boolean>(false);

    let cssProps: CSSProperties | undefined;

    if (item.lastTime) {
        const daysAgo = (props.now - item.lastTime) / 86400 / 1000;

        if (item.lowInterval && item.highInterval) {
            if (daysAgo < item.lowInterval.count) {
                cssProps = { backgroundColor: '#0f0' };
            } else if (daysAgo > item.highInterval.count) {
                cssProps = { backgroundColor: '#f00' };
            } else {
                const coefficient = (daysAgo - item.lowInterval.count) / (item.highInterval.count - item.lowInterval.count);
                cssProps = { backgroundColor: `rgb(${Math.round(100 * coefficient)}%, ${Math.round(100 * (1 - coefficient))}%, 0%)` };
            }
        } else if (item.lowInterval && !item.highInterval) {
            // Do no more often than X
            if (daysAgo < item.lowInterval.count) {
                cssProps = {backgroundColor: '#999'};
            }
        } else if (!item.lowInterval && item.highInterval) {
            // Do no less often than X
            if (daysAgo > item.highInterval.count) {
                cssProps = {backgroundColor: '#f00'};
            } else {
                cssProps = {backgroundColor: '#0f0'};
            }
        }
    }

    if (isEditing) {
        return <tr key={item.id}>
            <td colSpan={3}>
                <ItemAdder item={item} onDone={() => setIsEditing(false)}/>
            </td>
        </tr>;
    }

    return <tr key={item.id}>
        <td>
            <button
                onClick={() => guardedDoItem(item)}
                title={"Mark item as just done"}
            >
                {item.name}
            </button>
        </td>

        <td style={cssProps} className={styles.default.age}>
            {!item.lastTime && '?'}

            {item.lastTime && <span title={new Date(item.lastTime).toString()}>
                {describeWhen(props.today, item.lastTime)}
            </span>}
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
