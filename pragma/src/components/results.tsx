import { useLocation} from "react-router-dom";
import { jsPDF } from "jspdf";

const Results = () => {
const location = useLocation();
const result = location.state?.result;

const handleDownload = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(result, 180);
    doc.text(lines, 10,10);
    doc.save("generated-response.pdf")
};

if (!result) {
    return <p>No results available</p>

}

return (
<div style = {{padding: "20px"}}>
<h2> Generated phrases </h2>

<div style = {{whiteSpace: "pre-wrap"}}>
{result};

</div>

<button onClick = {handleDownload}>

Download as PDF
</button>

</div>

);
};

export default Results;