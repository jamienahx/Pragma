
import { Routes, Route} from 'react-router-dom';
import './App.css';
import Form from './components/form';
import Results from './components/results';

function App() {
  return(
    <Routes>

    <Route path="/" element = {<Form />} />
    <Route path="/results" element = {<Results/>} />

    </Routes>
  )
}

export default App
