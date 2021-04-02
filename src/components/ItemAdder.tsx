import * as React from 'react';
import {useState} from "react";
import {addItem} from "./DBParser";

declare const firebase: typeof import('firebase');

type Props = {
    user: firebase.User;
    itemsRef: firebase.database.Reference;
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
    const [addName, setAddName] = useState<string>("");
    const [addLowDays, setAddLowDays] = useState<string>("");
    const [addHighDays, setAddHighDays] = useState<string>("");

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

        addItem(props.itemsRef, { name: addName, lastTime: undefined })
            .then(() => setAddName(''));
    };

    return <div>
        <h3>Add an item</h3>
        <form onSubmit={onSubmit}>
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
                       />
                {' '}-{' '}
                <input type={"text"} value={addHighDays}
                       onChange={e => setAddHighDays(e.target.value)}
                /> days
            </p>
            <p>
                <input type={"submit"}
                       disabled={!validForm} value={"Add"}/>
            </p>
        </form>
    </div>;
};
