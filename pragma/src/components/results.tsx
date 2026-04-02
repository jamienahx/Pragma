import { useLocation} from "react-router-dom";

const Results = () => {
const location = useLocation();
const result = location.state?.result;

return (

<h2> Generated phrases </h2>
);
};

export default Results;