import { useLocation} from "react-router-dom";
import html2pdf from "html2pdf.js";
import languages from '../data/languages.json'
import './results.css';

const Results = () => {
const location = useLocation();
const result = location.state?.result;
const language = location.state?.language;
const selectedLanguage = languages.find(
    (lang) => lang.name === language);
const speechCode = selectedLanguage?.speechCode || "en-US";


const handleDownload = () => {
const element = document.getElementById("pdf-content");
if (!element) return;

html2pdf()
.from(element)
.save("generated-responses.pdf");
};

if (!result) {
    return <p>No results available</p>

}

const speakText = (text: string) => {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
     utterance.lang = speechCode;
    speechSynthesis.speak(utterance);
}

return (
<div className="results-container">
    <h2 className = "results-title">Generated Phrases</h2>

<div id = "pdf-content">
    {result.map ((item: any, index: number)=>(
        <div key={index} className="result-card">
            <p className="native"><strong>{item.native}</strong></p>
            <p className="romanized">{item.romanized}</p>
            <p className = "english">{item.english}</p>
            <button 
            className="audio-btn"
onClick={()=> 
    speakText(item.native)}>

    Play Audio
</button>
            </div>
    ))}
</div>

<button className = "download-btn" onClick = {handleDownload}>

Download as PDF
</button>



</div>

);
};


export default Results;