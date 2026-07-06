import { useEffect, useState } from "react";
import PostCard from "../components/PostCard.jsx";

function PostList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    useEffect(() => {
        fetch(`${BASEURL}/api/posts/`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch posts");
                }
                return response.json();
            })
            .then((data) => {
                setPosts(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50/50 !pt-24 p-6 sm:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header Skeleton */}
                    <div className="text-center mb-12 animate-pulse">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl mx-auto mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded-lg w-64 mx-auto mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
                    </div>
                    {/* Grid Skeleton */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <div key={n} className="bg-white rounded-2xl border border-gray-150 p-4 shadow-sm animate-pulse space-y-4">
                                <div className="w-full h-48 bg-gray-200 rounded-xl"></div>
                                <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-slate-50/50 pt-24 p-6">
                <div className="text-red-500 bg-red-50 px-6 py-5 rounded-2xl border border-red-100 shadow-sm max-w-md text-center">
                    <span className="text-3xl block mb-2">⚠️</span>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">Failed to Load Components</h3>
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pt-24 pb-16">
            {/* Banner Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <div className="bg-white rounded-3xl border border-gray-200/60 shadow-sm p-8 sm:p-12 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 opacity-70 pointer-events-none"></div>
                    <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-sm border border-indigo-100/50 animate-pulse">
                            ✨
                        </div>
                        {/* <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight mb-4">
                            UiWizard Gallery
                        </h1> */}
                        <p className="text-gray-500 text-base sm:text-lg font-medium max-w-2xl leading-relaxed">
                            Discover clean, customizable design components. View source codes, copy generated previews, and build your collection of favorites.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Grid Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-md mx-auto">
                            <span className="text-4xl block mb-2">📁</span>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">No components found</h3>
                            <p className="text-gray-500 text-sm">Be the first to generate and post a new UI component!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PostList;
