import * as React from "react";
import {Item} from "../DBParser";
import ItemRow from "./ItemRow";

const styles = require('./ItemList.css');

declare const firebase: typeof import('firebase');

type Props = {
    items: Item[];
}

export default (props: Props) => {
    // Auto-re-render every hour or so?
    const now = new Date().getTime();

    const today = new Date(now);
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

    console.log({
        now: {
            n: now,
            d: new Date(now),
        },
        today: {
            n: today.getTime(),
            d: today,
        },
    });

    if (props.items.length === 0) return <p><em>No items yet</em></p>;

    return <div className={styles.default.list}>
         {props.items.map((item, index) =>
            <ItemRow item={item} now={now} today={today} key={index}/>
        )}
    </div>;
};


