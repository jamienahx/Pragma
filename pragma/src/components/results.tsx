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

return (
<div style = {{padding: "20px"}}>
<h2> Generated phrases </h2>

<div id = "pdf-content">
<div style = {{whiteSpace: "pre-wrap"}}>
{result}

</div>
</div>

<button onClick = {handleDownload}>

Download as PDF
</button>

</div>

);
};

export default Results;