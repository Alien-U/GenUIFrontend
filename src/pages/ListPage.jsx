import { useList } from "../context/ListContext";
import { Link } from "react-router-dom";
import { useState } from "react";

function ListPage() {
    const { listItems, loading, removeFromList } = useList();
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const [deletingId, setDeletingId] = useState(null);

    const handleRemove = async (itemId) => {
        setDeletingId(itemId);
        try {
            await removeFromList(itemId);
        } catch (error) {
            console.error("Error removing item:", error);
        } finally {
            setDeletingId(null);
        }
    };

    if (loading && listItems.length === 0) {
        return (
            <div className="pt-20 min-h-screen bg-slate-50/50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-500 font-semibold tracking-wide">Loading your favorites...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="!pt-24 min-h-screen bg-slate-50/50 p-6 sm:p-8">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Saved Components</h1>
                    <p className="text-gray-500 text-base">All the components you saved for quick access and reuse</p>
                </div>

                {listItems.length === 0 ? (
                    <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm max-w-lg mx-auto">
                        <div className="text-5xl mb-4">❤️</div>
                        <h2 className="text-xl font-bold text-gray-800 mb-1">Your list is empty</h2>
                        <p className="text-gray-500 text-sm mb-6">Explore the generated UI components and save them here.</p>
                        <Link to="/" className="inline-flex items-center justify-center bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-sm">
                            Browse Components
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {listItems.map((item) => {
                            const snippet = item.post_content && item.post_content.length > 180
                                ? item.post_content.substring(0, 180) + "..."
                                : item.post_content || "";

                            const isDeleting = deletingId === item.id;

                            return (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-2xl border border-gray-200/70 shadow-sm hover:shadow-md hover:border-indigo-300 hover:scale-[1.005] transition-all duration-300 overflow-hidden flex flex-col md:flex-row group"
                                >
                                    {/* Left Side: Image */}
                                    <div className="w-full md:w-60 md:min-w-60 h-48 md:h-auto relative overflow-hidden bg-slate-100 border-b md:border-b-0 md:border-r border-gray-100">
                                        {item.post_image ? (
                                            <img
                                                src={`${BASEURL}${item.post_image}`}
                                                alt="Component Preview"
                                                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                No Preview Image
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Side: Content */}
                                    <div className="flex-1 p-6 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h2 className="text-lg font-bold text-gray-800 tracking-tight">
                                                    Component #{item.post}
                                                </h2>

                                                {/* Unfavourite Heart Button */}
                                                <button
                                                    onClick={() => handleRemove(item.id)}
                                                    disabled={isDeleting}
                                                    title="Unsave Component"
                                                    className={`w-9 h-9 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center transition-all border border-rose-100/60 shadow-sm disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 cursor-pointer`}
                                                >
                                                    {isDeleting ? (
                                                        <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-rose-500 text-rose-500 hover:scale-110 active:scale-90 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>

                                            {/* Code Preview Description */}
                                            {snippet && (
                                                <div className="mb-4">
                                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Code Snippet Preview</p>
                                                    <pre className="font-mono text-xs text-gray-600 bg-slate-50 p-4 rounded-xl border border-slate-100 overflow-hidden text-ellipsis whitespace-pre-wrap line-clamp-3 select-none">
                                                        {snippet}
                                                    </pre>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions Footer */}
                                        <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-2">
                                            <Link
                                                to={`/post/${item.post}`}
                                                className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-indigo-600 bg-white border border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50/50 rounded-xl active:scale-95 transition-all shadow-sm cursor-pointer"
                                            >
                                                Read More &rarr;
                                            </Link>
                                            <span className="text-xs text-gray-400">
                                                Added to favorites
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ListPage;