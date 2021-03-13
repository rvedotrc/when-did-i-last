import * as React from "react";
import {Item} from "./DBParser";
import ItemRow from "./ItemRow";

declare const firebase: typeof import('firebase');

type Props = {
    user: firebase.User;
    items: Item[];
}

export default (props: Props) => {
    // Auto-re-render every hour or so?
    const now = new Date().getTime();

    return <div>
        <h2>Items</h2>
        <ol>
            {props.items.map((item, index) =>
                <ItemRow item={item} now={now} key={index}/>
            )}
        </ol>
    </div>;
};


