import { useLocation} from "react-router-dom";

const Results = () => {
const location = useLocation();
const result = location.state?.result;

return (
<div style = {{padding: "20px"}}>
<h2> Generated phrases </h2>

<div style = {{whiteSpace: "pre-wrap"}}>
{result};

</div>
</div>

);
};

export default Results;