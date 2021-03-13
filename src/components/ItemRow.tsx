import * as React from 'react';
import {deleteItem, doItem, Item, renameItem} from "./DBParser";
import {useState} from "react";

declare const firebase: typeof import('firebase');

type Props = {
    item: Item;
    now: number;
    editMode: boolean;
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

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editName, setEditName] = useState<string>("");

    const startEdit = () => {
        setEditName(item.name);
        setIsEditing(true);
    };

    const validName = editName.match(/\S/);

    const saveName = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validName) return true;

        renameItem(item, editName).then(() => setIsEditing(false));
    }

    return <tr key={item.id}>
        <td>
            {!isEditing && <>{item.name}</>}

            {isEditing && <>
                <form
                    onSubmit={saveName}
                    onReset={() => setIsEditing(false)}
                >
                    <input type={"text"}
                           value={editName}
                           onChange={e => setEditName(e.target.value)}
                           autoFocus={true}
                    />
                    <input type={"submit"} value={"✅"} title={"Save"}/>
                    <input type={"reset"} value={"❌"} title={"Discard"}/>
                </form>
            </>}
        </td>

        <td>
            {!item.lastTime && 'never'}

            {item.lastTime && <span title={new Date(item.lastTime).toString()}>
                        {describeAge((props.now - item.lastTime) / 1000)}
                    </span>}
        </td>

        <td>
            <button onClick={() => doItem(item)} title={"Mark item as just done"}>
                💪🏻
            </button>
            {props.editMode && <>
                {' '}
                <button onClick={startEdit} title={"Edit item"}>
                    🖊
                </button>
                {' '}
                <button onClick={() => guardedDeleteItem(item)} title={"Delete item"}>
                    🗑
                </button>
            </>}
        </td>
    </tr>;
};
