import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useList } from "../context/ListContext";

function PostDetails() {
  const { id } = useParams();
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToList } = useList();

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

  const handleAddToList = () => {
    if (!localStorage.getItem("access_token")) {
      window.location.href = "/login";
      return;
    }
    addToList(post.id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Main Container */}
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">
        <div className="p-8 sm:p-12">
          
          {/* 1. Heading on Top */}
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tight">
              Copy the code for shown component
            </h1>
            <div className="inline-block bg-green-50 px-4 py-1.5 rounded-full">
              <span className="text-green-700 font-semibold tracking-wide">
                By {post.author}
              </span>
            </div>
          </div>

          {/* 2. Image */}
          <div className="mb-10 w-full overflow-hidden rounded-2xl shadow-sm border border-gray-100">
            <img
              src={`${post.image}`}
              alt={post.name || "Post Image"}
              className="w-full h-auto max-h-[500px] object-cover hover:scale-105 transition-transform duration-500 ease-in-out"
            />
          </div>

          {/* 3. Content */}
          <div className="mb-12">
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>

          {/* 4. Actions & Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 pt-8 gap-6">
            <button
              onClick={handleAddToList}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-rose-50 text-rose-600 border border-rose-200 px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-rose-100 hover:text-rose-700 hover:border-rose-300 transition-all shadow-sm active:scale-95"
            >
              Add to Lists ❤️
            </button>

            <Link
              to="/"
              className="group flex items-center text-gray-500 hover:text-blue-600 font-semibold transition-colors"
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