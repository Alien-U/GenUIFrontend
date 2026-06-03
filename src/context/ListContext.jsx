import { createContext, useContext, useState, useEffect, createRef } from "react";
import { authFetch, getAccessToken } from "../utils/auth";

const ListContext = createContext();

export const ListProvider = ({ children }) => {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const [listItems, setListItems] = useState([]);
    const [total, setTotal] = useState(0);

    //Fetch List form BE
    const fetchList = async () => {
        try {
            const res = await authFetch(`${BASEURL}/api/lists/`)
            const data = await res.json();
            setListItems(data.items || []);
            setTotal(data.total || 0);
        } catch (error) {
            console.error("Error fetching list:", error);
        }
    }

    useEffect(() => {
        fetchList();
    }, []);

    //Add Product to List
    const addToList = async (postId) => {
        try{
            await authFetch(`${BASEURL}/api/lists/add/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ post_id: postId }),
            });
            fetchList();
        } catch (error) {
            console.error("Error adding to list:", error);
        }
    }

    //Remove Product from List
    const removeFromList = async (itemId) => {
        try{
            await authFetch(`${BASEURL}/api/lists/remove/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ item_id: itemId }),
            });
            fetchList();
        } catch (error) {
            console.error("Error removing from list:", error);
        }
    }

    //Update Quantity
    const updateQuantity = async (itemId, quantity) => {
        if (quantity < 1){
            await removeFromCart(itemId);
            return;
        }
        try{
            await authFetch(`${BASEURL}/api/lists/update/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ item_id: itemId, quantity }),
            });
            fetchList();
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    }

    const clearList = () => {
        setListItems([]);
        setTotal(0);
    }

    return (
        <ListContext.Provider
        value={{ listItems,total, addToList, removeFromList, updateQuantity, clearList }}>
            {children}
        </ListContext.Provider>
    );
};

export const useList = () => useContext(ListContext);