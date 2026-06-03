import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Nabvar from './components/Navbar';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Post from "./pages/Post";
import PostLists from "./pages/PostLists";
import PostDetails from "./pages/PostDetails";
import PrivateRouter from './components/PrivateRouter';
import ListPage from './pages/ListPage';
import CodeGenerator from './pages/CodeGenerator';


function App() {
    return (
        <Router>
            <Nabvar/>
            <Routes>
                <Route path="/" element={<PostLists/>}/>
                <Route path="/post/:id" element={<PostDetails/>}/>
                <Route path="/list" element={<ListPage/>}/>
                <Route path="/login" element={<Login/>} />
                <Route path="/signup" element={<Signup/>} />
                <Route path="/post" element={<Post/>} />
                <Route path="/PostLists" element={<PostLists/>} />
                <Route path="/CodeGenerator" element={<CodeGenerator/>} />
            </Routes>
        </Router>
    );
}

export default App;