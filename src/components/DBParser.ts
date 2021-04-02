declare const firebase: typeof import('firebase');

export type Item = {
    id: string;
    ref: firebase.database.Reference;
    name: string;
    lastTime?: number;
    lowInterval?: {
        count: number;
        units: "d";
    };
    highInterval?: {
        count: number;
        units: "d";
    };
}

export type UnsavedItem = Omit<Item, "id" | "ref">

const deserialiseItem = (itemRef: firebase.database.Reference, id: string, v: any): Item | undefined => {
    if (!v) return;

    const name = v.name;
    if (typeof name !== 'string') return;

    const lastTime = v.lastTime;
    if (lastTime && typeof lastTime !== 'number') return;

    return {
        id,
        ref: itemRef,
        name,
        lastTime: lastTime || undefined,
        lowInterval: deserialiseInterval(v.lowInterval),
        highInterval: deserialiseInterval(v.highInterval),
    };
};

const deserialiseInterval = (data: any): {
    count: number;
    units: "d";
} | undefined => {
    if (!data) return;

    const count = data.count;
    if (typeof count !== 'number') return;

    const units = data.units;
    if (units !== 'd') return;

    return { count, units };
};

const serialiseItem = (item: UnsavedItem): any => ({
    name: item.name,
    lastTime: item.lastTime || null,
    lowInterval: item.lowInterval || null,
    highInterval: item.highInterval || null,
});

export const parseItems = (itemsRef: firebase.database.Reference, data: any): Item[] => {
    if (!data) return [];

    const items: Item[] = [];

    Object.keys(data).forEach(id => {
        const itemRef = itemsRef.child(id);
        const v = data[id];
        const maybeItem = deserialiseItem(itemRef, id, v);
        if (maybeItem) items.push(maybeItem);
    });

    return items.sort((a, b) => {
        let r = a.name.localeCompare(b.name);
        if (r === 0) r = a.id.localeCompare(b.id);
        return r;
    });
};

export const addItem = (itemsRef: firebase.database.Reference, item: UnsavedItem): Promise<void> =>
    itemsRef.push().set(serialiseItem(item));

export const doItem = (item: Item): Promise<void> => {
    const t = new Date().getTime();
    const newItem: Item = { ...item, lastTime: t };
    return item.ref.set(serialiseItem(newItem));
};

export const renameItem = (item: Item, name: string): Promise<void> => {
    const newItem: Item = { ...item, name };
    return item.ref.set(serialiseItem(newItem));
};

export const deleteItem = (item: Item): Promise<void> =>
    item.ref.remove();
