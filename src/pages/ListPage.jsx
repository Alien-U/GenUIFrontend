import { useList } from "../context/ListContext";
import { Link } from "react-router-dom";

function ListPage() {
    const { listItems,total, removeFromList, updateQuantity } = useList();
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    console.log("List Items:", listItems);

    return (
        <div className="pt-20 min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Your List</h1>
            {listItems.length === 0 ? (
                <p className="text-center text-gray-600">Your list is empty.</p>
            ) : (
                <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                    {listItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between mb-4"
                        >
                            <div className="flex items-center gap-4">
                                {item.post_image && (
                                    <img
                                        src={`${BASEURL}${item.post_image}`}
                                        alt={item.post_name}
                                        className="w-20 h-20 object-cover rounded"
                                    />
                                )}
                            </div>
                            <div>
                                {/* <h2 className="text-lg font-semibold">
                                    {item.post_name}
                                </h2>
                                <p className="text-gray-600">
                                    ${item.post_price}
                                </p> */}
                            </div>

                            <div className="flex items-center gap-3">
                                <button className="bg-gray-300 px-3 py-1 rounded"
                                    onClick={() =>
                                        updateQuantity(
                                            item.id,
                                            item.quantity - 1
                                        )
                                    }
                                >
                                    -
                                </button>
                                <span>{item.quantity}</span>
                                <button className="bg-gray-300 px-3 py-1 rounded"
                                    onClick={() =>
                                        updateQuantity(
                                            item.id,
                                            item.quantity + 1
                                        )
                                    }
                                >
                                    +
                                </button>
                                <button className="text-red-500"
                                    onClick={() => removeFromList(item.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="border-t pt-4 mt-4 flex justify-between items-center">
                        <h2 className="text-xl font-bold">Total:</h2>
                        <p className="text-xl font-semibold">{total}</p>
                        {/* <Link to="/checkout" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                            Proceed to Checkout
                        </Link> */}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ListPage;