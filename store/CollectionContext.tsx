import React, { createContext, useContext, useState, useEffect } from "react";
import { loadCollection, saveCollection, CollectionItem } from "./collectionStore";

type CollectionContextType = {
    collection: CollectionItem[];
    addItem: (item: CollectionItem) => void;
    removeItem: (id: string) => void;
    updateItem: (item: CollectionItem) => void;
};

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

export const CollectionProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [collection, setCollection] = useState<CollectionItem[]>([]);

    useEffect(() => {
        (async () => {
            const items = await loadCollection();
            setCollection(items);
        })();
    }, []);

    const save = async (items: CollectionItem[]) => {
        setCollection(items);
        await saveCollection(items);
    };

    const addItem = async (item: CollectionItem) => {
        await save([...collection, item]);
    };

    const removeItem = async (id: string) => {
        await save(collection.filter(i => i.id !== id));
    };

    const updateItem = async (item: CollectionItem) => {
        await save(collection.map(i => i.id === item.id ? item : i));
    };

    return (
        <CollectionContext.Provider value={{ collection, addItem, removeItem, updateItem }}>
            {children}
        </CollectionContext.Provider>
    );
};

export const useCollection = () => {
    const context = useContext(CollectionContext);
    if (!context) throw new Error('useCollection must be used within CollectionProvider');
    return context;
};