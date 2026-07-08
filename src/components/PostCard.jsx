import { Link } from "react-router-dom";
import { useList } from "../context/ListContext";
import { useState } from "react";

function PostCard({ post }) {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const { listItems, addToList, removeFromList } = useList();
  const [actionLoading, setActionLoading] = useState(false);

  const favoriteItem = listItems.find(item => item.post === post.id);
  const isFavorite = !!favoriteItem;

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!localStorage.getItem("access_token")) {
      window.location.href = "/login";
      return;
    }
    setActionLoading(true);
    try {
      if (isFavorite) {
        await removeFromList(favoriteItem.id);
      } else {
        await addToList(post.id);
      }
    } catch (err) {
      console.error("Action failed:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const previewText = post.content && post.content.length > 120
    ? post.content.substring(0, 120) + "..."
    : post.content || "";

  return (
    <div className="bg-white rounded-2xl border border-gray-200/75 shadow-sm hover:shadow-md hover:border-indigo-300 hover:scale-[1.01] transition-all duration-300 overflow-hidden flex flex-col group relative">
      {/* Image Container */}
      <div className="w-full h-48 bg-slate-50 overflow-hidden relative border-b border-gray-100">
        {post.image_url ? (
          <img
            src={post.image_url}
            alt="Component Preview"
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No Preview</div>
        )}

        {/* Floating Heart Icon */}
        <button
          onClick={handleFavoriteClick}
          disabled={actionLoading}
          title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow border cursor-pointer ${isFavorite
            ? "bg-rose-50 border-rose-100 text-rose-500 hover:bg-rose-100"
            : "bg-white/80 backdrop-blur-sm border-gray-150 text-gray-800 hover:text-rose-500 hover:bg-white"
            }`}
        >
          {actionLoading ? (
            <svg className="animate-spin h-4 w-4 text-rose-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4.5 w-4.5 ${isFavorite ? "fill-rose-500 text-rose-500" : "fill-text text-gray-400"}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      {/* Info Content */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <h2 className="text-sm font-bold text-gray-800 tracking-tight mb-2">
            Component #{post.id}
          </h2>

          {previewText && (
            <pre className="font-mono text-[11px] text-gray-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 overflow-hidden line-clamp-2 select-none mb-1">
              {previewText}
            </pre>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
          <Link
            to={`/post/${post.id}`}
            className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-bold text-gray-650 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl transition-all cursor-pointer"
          >
            Read More &rarr;
          </Link>

          {isFavorite ? (
            <div className="flex-1 flex items-center justify-center gap-1 bg-rose-50/60 text-rose-600 border border-rose-100/50 rounded-xl text-[11px] font-extrabold select-none">
              Saved ❤️
            </div>
          ) : (
            <button
              onClick={handleFavoriteClick}
              disabled={actionLoading}
              className={`flex-1 flex items-center justify-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-100 hover:border-indigo-200 rounded-xl text-xs font-bold transition-all ${actionLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer active:scale-95"
                }`}
            >
              {actionLoading ? "Saving" : "Save"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostCard;
