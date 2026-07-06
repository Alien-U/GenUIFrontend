import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const BASE = import.meta.env.VITE_DJANGO_BASE_URL;
  const [form, setForm] = useState({ username: "", email: "", password: "", password2: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/register/`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if(res.ok) {
        setMsg("Account created successfully! Redirecting to login...");
        setTimeout(()=>nav("/login"), 1200);
      } else {
        setMsg(data.username || data.password || JSON.stringify(data));
      }
    } catch(err) {
      console.error(err);
      setMsg("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-50 to-indigo-50/50 p-6 pt-20">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100/80 transition-all duration-300">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Create Account</h2>
        <p className="text-gray-500 text-sm mb-6">Join GenUi and start generating components</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Username</label>
            <input 
              name="username" 
              onChange={handleChange} 
              value={form.username} 
              placeholder="Pick a username" 
              required 
              disabled={loading}
              className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
            <input 
              name="email" 
              type="email" 
              onChange={handleChange} 
              value={form.email} 
              placeholder="you@example.com" 
              disabled={loading}
              className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
            <input 
              name="password" 
              type="password" 
              onChange={handleChange} 
              value={form.password} 
              placeholder="••••••••" 
              required 
              disabled={loading}
              className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Confirm Password</label>
            <input 
              name="password2" 
              type="password" 
              onChange={handleChange} 
              value={form.password2} 
              placeholder="••••••••" 
              required 
              disabled={loading}
              className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:bg-gray-50 disabled:text-gray-400"
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
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {msg && (
          <div className={`mt-4 p-3 rounded-xl text-sm font-medium border text-center ${
            msg.includes("successfully") 
              ? "bg-green-50 text-green-700 border-green-100" 
              : "bg-red-50 text-red-700 border-red-100"
          }`}>
            {msg}
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 font-semibold hover:underline">
            Login
          </a>
        </div>
      </div>
    </div>
  );
}

export default Signup;
