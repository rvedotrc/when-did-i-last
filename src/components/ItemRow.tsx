import * as React from 'react';
import {deleteItem, doItem, Item, renameItem} from "./DBParser";
import {useState} from "react";

declare const firebase: typeof import('firebase');

type Props = {
    item: Item;
    today: Date;
    editMode: boolean;
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
            {!isEditing && <>
                <button
                    onClick={() => guardedDoItem(item)}
                    title={"Mark item as just done"}
                >
                    {item.name}
                </button>
            </>}

            {isEditing && <>
                <form
                    onSubmit={saveName}
                    onReset={() => setIsEditing(false)}
                >
                    <input type={"text"}
                           value={editName}
                           onChange={e => setEditName(e.target.value)}
                           onKeyDown={e => {
                               if (e.key === 'Escape') setIsEditing(false);
                           }}
                           autoFocus={true}
                    />
                    <input type={"submit"} value={"✅"} title={"Save"}/>
                    <input type={"reset"} value={"❌"} title={"Discard"}/>
                </form>
            </>}
        </td>

        <td>
            {!item.lastTime && '?'}

            {item.lastTime && <span title={new Date(item.lastTime).toString()}>
                        {describeWhen(props.today, item.lastTime)}
                    </span>}
        </td>

        <td>
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
