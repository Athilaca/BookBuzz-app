
import './App.css';
import Signup from './Components/Signup';
import Home from './Components/Home';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';

function App() {
  return (
    <div className="App">
     <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        {/* <Route path="login" element={<Login/>}/> */}
        <Route path="signup" element={<Signup/>} />
        
      </Routes>
    </Router>
    </div>
  );
}

export default App;
