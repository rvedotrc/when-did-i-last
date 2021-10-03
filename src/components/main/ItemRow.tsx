import * as React from 'react';
import {doItem, Item} from "../DBParser";
import {CSSProperties} from "react";

const styles = require('./ItemRow.css');

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

export default (props: Props) => {
    const { item } = props;

    let cssProps: CSSProperties | undefined;

    if (item.lastTime) {
        const daysAgo = (props.now - item.lastTime) / 86400 / 1000;

        if (item.lowInterval && item.highInterval) {
            if (daysAgo < item.lowInterval.count) {
                cssProps = {
                    backgroundColor: '#0f0',
                    color: '#000',
                };
            } else if (daysAgo > item.highInterval.count) {
                cssProps = {
                    backgroundColor: '#f00',
                    color: '#fff',
                };
            } else {
                const coefficient = (daysAgo - item.lowInterval.count) / (item.highInterval.count - item.lowInterval.count);
                cssProps = {
                    backgroundColor: `rgb(${Math.round(100 * coefficient)}%, ${Math.round(100 * (1 - coefficient))}%, 0%)`,
                    color: coefficient < 0.5 ? '#000' : '#fff',
                };
            }
        } else if (item.lowInterval && !item.highInterval) {
            // Do no more often than X
            if (daysAgo < item.lowInterval.count) {
                cssProps = {
                    backgroundColor: '#999',
                    color: '#000',
                };
            }
        } else if (!item.lowInterval && item.highInterval) {
            // Do no less often than X
            if (daysAgo > item.highInterval.count) {
                cssProps = {
                    backgroundColor: '#f00',
                    color: '#fff',
                };
            } else {
                cssProps = {
                    backgroundColor: '#0f0',
                    color: '#000',
                };
            }
        }
    }

    return <button
        onClick={() => guardedDoItem(item)}
        title={"Mark item as just done"}
        key={item.id}
        style={cssProps}
        className={styles.default.item}
    >
        <div className={styles.default.name}>
            {item.name}
        </div>

        <div className={styles.default.age}>
            {!item.lastTime && '?'}

            {item.lastTime && <span title={new Date(item.lastTime).toString()}>
                        {describeWhen(props.today, item.lastTime)}
                    </span>}
        </div>
    </button>;
};
