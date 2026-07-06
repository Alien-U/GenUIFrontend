import { createContext, useContext, useState, useEffect, createRef } from "react";
import { authFetch, getAccessToken } from "../utils/auth";

const ListContext = createContext();

export const ListProvider = ({ children }) => {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const [listItems, setListItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    //Fetch List form BE
    const fetchList = async () => {
        setLoading(true);
        try {
            const res = await authFetch(`${BASEURL}/api/lists/`)
            const data = await res.json();
            setListItems(data.items || []);
            setTotal(data.total || 0);
            return data;
        } catch (error) {
            console.error("Error fetching list:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchList();
    }, []);

    //Add Product to List
    const addToList = async (postId) => {
        try{
            const res = await authFetch(`${BASEURL}/api/lists/add/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ post_id: postId }),
            });
            await fetchList();
            return res;
        } catch (error) {
            console.error("Error adding to list:", error);
            throw error;
        }
    }

    //Remove Product from List
    const removeFromList = async (itemId) => {
        try{
            const res = await authFetch(`${BASEURL}/api/lists/remove/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ item_id: itemId }),
            });
            await fetchList();
            return res;
        } catch (error) {
            console.error("Error removing from list:", error);
            throw error;
        }
    }

    //Update Quantity
    const updateQuantity = async (itemId, quantity) => {
        if (quantity < 1){
            await removeFromList(itemId);
            return;
        }
        try{
            const res = await authFetch(`${BASEURL}/api/lists/update/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ item_id: itemId, quantity }),
            });
            await fetchList();
            return res;
        } catch (error) {
            console.error("Error updating quantity:", error);
            throw error;
        }
    }

    const clearList = () => {
        setListItems([]);
        setTotal(0);
    }

    return (
        <ListContext.Provider
        value={{ listItems, total, loading, addToList, removeFromList, updateQuantity, clearList, fetchList }}>
            {children}
        </ListContext.Provider>
    );
};

export const useList = () => useContext(ListContext);