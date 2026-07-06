import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useList } from "../context/ListContext";

function PostDetails() {
  const { id } = useParams();
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [copied, setCopied] = useState(false);
  const { listItems, addToList, removeFromList } = useList();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BASEURL}/api/posts/${id}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch post details");
        }
        return response.json();
      })
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [id, BASEURL]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-xl font-medium text-gray-500 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-red-500 bg-red-50 px-6 py-4 rounded-xl border border-red-100">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-gray-500 text-lg">No post found</div>
      </div>
    );
  }

  const favoriteItem = listItems.find(item => item.post === post.id);
  const isFavorite = !!favoriteItem;

  const handleCopy = () => {
    if (!post?.content) return;
    navigator.clipboard.writeText(post.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleFavorite = async () => {
    if (!localStorage.getItem("access_token")) {
      navigate("/login");
      return;
    }
    setAdding(true);
    try {
      if (isFavorite) {
        await removeFromList(favoriteItem.id);
      } else {
        await addToList(post.id);
      }
      navigate("/list");
    } catch (err) {
      console.error("Error toggling list:", err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Main Container */}
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl overflow-hidden border border-gray-200/80">
        <div className="p-8 sm:p-12">
          
          {/* 1. Heading on Top */}
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tight">
              Component Details
            </h1>
            <div className="inline-block bg-green-50 px-4 py-1.5 rounded-full">
              <span className="text-green-700 font-semibold tracking-wide">
                By {post.author || "GenUi Creator"}
              </span>
            </div>
          </div>

          {/* 2. Image */}
          <div className="mb-10 w-full overflow-hidden rounded-2xl shadow-sm border border-gray-150">
            <img
              src={`${post.image}`}
              alt={post.name || "Post Image"}
              className="w-full h-auto max-h-[500px] object-cover hover:scale-105 transition-transform duration-500 ease-in-out"
            />
          </div>

          {/* 3. Code Block Content */}
          <div className="mb-12">
            <div className="flex justify-between items-center bg-slate-900 border-b border-slate-800 px-5 py-3 rounded-t-2xl shadow-sm">
              <span className="font-mono text-xs text-slate-400 font-bold uppercase tracking-wider">Source Code</span>
              <button
                onClick={handleCopy}
                className="text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-750 hover:border-slate-600 px-3 py-1.5 rounded-lg transition-all font-semibold cursor-pointer active:scale-95"
              >
                {copied ? "Copied! ✓" : "Copy Code"}
              </button>
            </div>
            <pre className="font-mono text-xs sm:text-sm text-slate-100 bg-slate-950 p-6 rounded-b-2xl whitespace-pre-wrap overflow-x-auto border-x border-b border-slate-900 leading-relaxed shadow-inner max-h-[600px] scrollbar-thin scrollbar-thumb-slate-800 select-all">
              {post.content}
            </pre>
          </div>

          {/* 4. Actions & Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 pt-8 gap-6">
            <button
              onClick={handleToggleFavorite}
              disabled={adding}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 border px-8 py-3.5 rounded-xl font-bold text-base transition-all shadow-sm ${
                adding
                  ? "bg-rose-100 text-rose-400 border-rose-200 cursor-not-allowed"
                  : isFavorite
                    ? "bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200/60 hover:text-rose-800 hover:border-rose-300 active:scale-95 cursor-pointer"
                    : "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100 hover:text-rose-700 hover:border-rose-300 active:scale-95 cursor-pointer"
              }`}
            >
              {adding ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-rose-500" xmlns="http://www.w3.org/2050/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : isFavorite ? (
                <>Remove from Lists 💔</>
              ) : (
                <>Add to Lists ❤️</>
              )}
            </button>

            <Link
              to="/"
              className="group flex items-center text-gray-500 hover:text-indigo-650 font-semibold transition-colors text-base"
            >
              <span className="mr-2 group-hover:-translate-x-1 transition-transform">
                &larr;
              </span>
              Back to Home
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PostDetails;