import * as React from 'react';
import {useState} from "react";
import {addItem, Item, saveItem} from "./DBParser";

declare const firebase: typeof import('firebase');

type Props = {
    itemsRef: firebase.database.Reference;
    onDone?: () => void;
} | {
    item: Item;
    onDone?: () => void;
}

const parseInterval = (t: string): {
    count: number;
    units: "d";
} | undefined | "error" => {
    t = t.trim();
    if (t === '') return undefined;

    const n = parseFloat(t);
    if (isNaN(n)) return "error";
    if (n.toString() !== t) return "error";

    return { count: n, units: "d" };
};

export default (props: Props) => {
    const item = ("item" in props) ? props.item : undefined;

    const [addName, setAddName] = useState<string>(item ? item.name : "");
    const [addLowDays, setAddLowDays] = useState<string>(item?.lowInterval ? item.lowInterval.count.toString() : "");
    const [addHighDays, setAddHighDays] = useState<string>(item?.highInterval ? item.highInterval.count.toString() : "");

    const low = parseInterval(addLowDays);
    const high = parseInterval(addHighDays);

    const validForm = (
        addName.match(/\S/)
        && low !== "error"
        && high !== "error"
        && ((low === undefined) === (high === undefined))
    );

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validForm) return;

        // (Type-narrowing by hand)
        if (low === "error" || high === "error") return;

        if ("itemsRef" in props) {
            addItem(props.itemsRef, {
                name: addName,
                lowInterval: low,
                highInterval: high,
                lastTime: undefined,
            })
                .then(() => setAddName(''))
                .then(props.onDone);
        } else {
            saveItem({
                ...props.item,
                name: addName,
                lowInterval: low,
                highInterval: high,
            }).then(props.onDone);
        }
    };

    return <div>
        <h3>{item ? "Edit an item" : "Add an item"}</h3>
        <form onSubmit={onSubmit} onReset={props.onDone}>
            <p>
                <input type={"text"}
                       value={addName}
                       onChange={e => setAddName(e.target.value)}
                />
            </p>
            <p>
                Target range:{' '}
                <input type={"text"} value={addLowDays}
                       onChange={e => setAddLowDays(e.target.value)}
                       size={3}
                       />
                {' '}-{' '}
                <input type={"text"} value={addHighDays}
                       onChange={e => setAddHighDays(e.target.value)}
                       size={3}
                /> days
            </p>
            <p>
                <input type={"submit"}
                       disabled={!validForm} value={item ? "Update" : "Add"}/>
                {props.onDone && (
                    <input type={"reset"}
                           value={"Cancel"}/>
                )}
            </p>
        </form>
    </div>;
};
