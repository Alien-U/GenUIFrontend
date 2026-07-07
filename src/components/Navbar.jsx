import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useList } from '../context/ListContext.jsx';
import { clearTokens, getAccessToken } from '../utils/auth.js';

function Navbar() {
    const { listItems } = useList();
    const navigate = useNavigate();
    
    // Add state to handle the mobile menu toggle
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const listCount = listItems.reduce((total, item) => total + item.quantity, 0);
    const isLoggedIn = !!getAccessToken();

    const handleLogout = () => {
        clearTokens();
        setIsMobileMenuOpen(false); // Close mobile menu on logout
        navigate('/login');
    };

    return (
        <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                
                {/* 1. Brand / Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <span className="text-2xl transition-transform group-hover:scale-110">✨</span>
                    <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                        UiWizard
                    </span>
                </Link>

                {/* 2. Navigation & Actions Container */}
                <div className="flex items-center gap-5 sm:gap-8">
                    
                    {/* Desktop Main Nav Links (Disappears below 768px) */}
                    {isLoggedIn && (
                        <div className="hidden md:flex items-center gap-6">
                            <Link to="/PostLists" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors">
                                Articles
                            </Link>
                            <Link to="/CodeGenerator" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors">
                                Generate
                            </Link>
                            <Link to="/Post" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors">
                                Create Post
                            </Link>
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        {/* Lists Button with Badge (Visible on all devices) */}
                        <Link 
                            to="/list" 
                            className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-rose-500 transition-colors"
                            title="Your Lists"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {listCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-[20px] bg-rose-500 text-white text-[10px] font-bold rounded-full px-1.5 shadow-sm border-2 border-white">
                                    {listCount}
                                </span>
                            )}
                        </Link>

                        {/* Visual Divider */}
                        <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

                        {/* Auth Buttons Desktop */}
                        {!isLoggedIn ? (
                            <div className="items-center gap-3 hidden md:flex">
                                <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors">
                                    Login
                                </Link>
                                <Link to="/signup" className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-sm">
                                    Sign Up
                                </Link>
                            </div>
                        ) : (
                            <button 
                                onClick={handleLogout} 
                                className="text-sm font-semibold bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors hidden md:block"
                            >
                                Logout
                            </button>
                        )}

                        {/* Hamburger Menu Button (Only visible below 768px) */}
                        <button 
                            className="md:hidden p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown (Visible only below 768px when toggled) */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 shadow-lg px-4 pt-2 pb-4 space-y-3">
                    {isLoggedIn && (
                        <>
                            <Link 
                                to="/PostLists" 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                            >
                                Articles
                            </Link>
                            <Link 
                                to="/CodeGenerator" 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                            >
                                Generate
                            </Link>
                            <Link 
                                to="/Post" 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                            >
                                Create Post
                            </Link>
                        </>
                    )}

                    {/* Mobile Auth Buttons */}
                    <div className="pt-4 border-t border-gray-200">
                        {!isLoggedIn ? (
                            <div className="flex flex-col gap-2">
                                <Link 
                                    to="/login" 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block text-center w-full px-4 py-2 text-base font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100"
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/signup" 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block text-center w-full px-4 py-2 text-base font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        ) : (
                            <button 
                                onClick={handleLogout}
                                className="block w-full text-center px-4 py-2 text-base font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;