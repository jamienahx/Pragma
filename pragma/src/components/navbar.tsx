import { useLocation, useNavigate } from "react-router-dom";

const NavBar =() => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleHomeClick = () => {
        if(location.pathname ==="/") {
            window.location.reload();
    } else {
        navigate("/")
    }  
}

return (
    <nav style = {{ padding: "10px", borderBottom: "1px solid solid #ccc"}}>
        <button onClick = {handleHomeClick}>
            Home
        </button>
        </nav>
);

};

export default NavBar