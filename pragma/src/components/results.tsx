import { useLocation} from "react-router-dom";
import html2pdf from "html2pdf.js";

const Results = () => {
const location = useLocation();
const result = location.state?.result;

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
    const utterance = new SpeechSynthesisUtterance(text);
     utterance.lang = "ja-JP";
    speechSynthesis.speak(utterance);
}

return (
<div style = {{padding: "20px"}}>
<h2> Generated phrases </h2>

<div id = "pdf-content">
    {result.map ((item: any, index: number)=>(
        <div key={index} style ={{marginBottom:"15px"}}>
            <p><strong>{item.native}</strong></p>
            <p>{item.romanized}</p>
            <p>{item.english}</p>
            </div>
    ))}
</div>

<button onClick = {handleDownload}>

Download as PDF
</button>

<button 
onClick={()=> 
    speakText(result.map((item: any)=> item.native).join("."))
}
>
    Play Audio
</button>

</div>

);
};


export default Results;