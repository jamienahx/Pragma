import { useState } from 'react';


const Form =()=> {
const [formData, setFormData] = useState({
    identityInput:"",
    otherPartyInput:"",
    descriptionInput:""
})

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prev=>({
            ...prev,
            [name]: value,
        }))
    }

    return(
        <>
        
        <label htmlFor="identityInput">Who are you: </label>
        <input id = "identityInput" 
        name = "identityInput" 
        type = "text"
        value = {formData.identityInput}
        onChange= {handleChange}/>



          <label htmlFor="otherPartyInput">Who are you speaking to: </label>
        <input id = "otherPartyInput" 
        name = "otherPartyInput" 
        type = "text"
        value = {formData.otherPartyInput}
        onChange= {handleChange}/>


        <label htmlFor="descriptionInput">Describe the situation at hand:  </label>
        <input id = "descriptionInput" 
        name = "descriptionInput" 
        type = "text"
        value = {formData.descriptionInput}
        onChange= {handleChange}/>



        </>


    );
};

export default Form;