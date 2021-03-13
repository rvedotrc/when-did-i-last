import * as React from 'react';
import {useState} from "react";
import {addItem} from "./DBParser";

declare const firebase: typeof import('firebase');

type Props = {
    user: firebase.User;
    itemsRef: firebase.database.Reference;
}

export default (props: Props) => {

    const [addName, setAddName] = useState<string>("");

    const validName = addName.match(/\S/);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validName) return;

        addItem(props.itemsRef, { name: addName, lastTime: undefined })
            .then(() => setAddName(''));
    };

    return <div>
        <h3>Add another...</h3>
        <form onSubmit={onSubmit}>
            <p>
                <input type={"text"}
                       value={addName}
                       onChange={e => setAddName(e.target.value)}
                />
                <input type={"submit"}
                       disabled={!validName} value={"Add"}/>
            </p>
        </form>
    </div>;
};
