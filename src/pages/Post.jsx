import React, { useState } from 'react';

const Post = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic validation
    if (!text && !image) {
      alert("Please add some text or an image.");
      return;
    }

    setLoading(true);

    // 1. Prepare Multipart Form Data
    const formData = new FormData();
    formData.append('content', text); // Must match 'content' in Django Serializer
    if (image) {
      formData.append('image', image); // Must match 'image' in Django Serializer
    }

    // 2. Retrieve JWT Token (Assuming it's stored in localStorage)
    const token = localStorage.getItem('access');

    try {
      const response = await fetch(`${BASE}/api/posts/create/`, {
        method: 'POST',
        // headers: {
        // If your backend is protected by JWT, this is mandatory
        // 'Authorization': `Bearer ${token}`,
        // WARNING: Do NOT set 'Content-Type'. The browser handles it for FormData.
        // },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Post successful:', data);
        alert('Post published!');
        setText('');
        setImage(null);
        // Reset the file input manually if needed
        document.getElementById('imageInput').value = '';
      } else {
        // Log backend validation errors (e.g., "This field is required")
        console.error('Backend Error Details:', data);
        alert(`Error: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error('Network/Connection Error:', error);
      alert('Could not connect to the server. Check if Django is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-md border border-gray-200/80">
        <h5 className="text-2xl font-extrabold text-gray-410 tracking-tight mb-2">New Component Post</h5>
        <p className="text-gray-500 text-sm mb-6">Share your generated component and code with the gallery community</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Attachment Preview</label>
            <input 
              id="imageInput"
              type="file" 
              accept="image/*" 
              onChange={(e) => setImage(e.target.files[0])} 
              disabled={loading}
              className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:bg-gray-50 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-650 hover:file:bg-indigo-100 cursor-pointer file:cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Content / Code</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your component code or write a description..."
              disabled={loading}
              className="w-full min-h-[220px] p-4 font-mono text-xs sm:text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:bg-gray-50 disabled:text-gray-400 bg-slate-50 resize-y leading-relaxed"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold transition-all duration-300 shadow-md ${
              loading 
                ? "bg-indigo-400 cursor-not-allowed opacity-80" 
                : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] cursor-pointer"
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Posting Component...
              </>
            ) : 'Post to Feed'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Post;