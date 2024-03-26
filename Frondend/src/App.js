
import './App.css';
import Signup from './Components/Signup';
import Home from './Components/Home';
import Login from './Components/Login';

import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Detail from './Components/Detail';

function App() {
  return (
    <div className="App">
     <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="login" element={<Login/>}/>
        <Route path="signup" element={<Signup/>} />
        <Route path="/detail/:bookId" element={<Detail/>} />
        
      </Routes>
    </Router>
    </div>
  );
}

export default App;
