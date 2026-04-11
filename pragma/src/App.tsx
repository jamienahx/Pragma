
import {Routes, Route} from 'react-router-dom';
import './App.css';
import Form from './components/form';
import Results from './components/results';
import Navbar from './components/navbar';

function App() {
  return(
    <div className="app-wrapper">

     <Navbar />
     <main className="app-content">
    <Routes>
     

    <Route path="/" element = {<Form />} />
    <Route path="/results" element = {<Results/>} />

    </Routes>
    </main>
    </div>

  )
}

export default App
