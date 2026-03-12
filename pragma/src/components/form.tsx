import { useState } from 'react';
import './form.css';
import languages from '../data/languages.json';

const Form =()=> {
const [formData, setFormData] = useState({
    identityInput:"",
    otherPartyInput:"",
    descriptionInput:"",
    language: ""
})

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData(prev=>({
            ...prev,
            [name]: value,
        }))
    }

    return(
        
        <div className = "form-container">

        <div className="form-field">
         <label htmlFor="language">Language:</label>
         <select
         id="language"
         name="language"
         value={formData.language}
         onChange={handleChange}
         >
            <option value = "">Select a Language</option>
       
        {languages.map((lang)=> (
            <option key ={lang.code} value ={lang.code}>
                {lang.name}
            </option>
        ))}
        </select>
        </div>




        <div className = "form-field">
        <label htmlFor="identityInput">Who are you: </label>
        <input id = "identityInput" 
        name = "identityInput" 
        type = "text"
        value = {formData.identityInput}
        onChange= {handleChange}
        placeholder = "eg. Employee"/>
        </div>


         <div className = "form-field">
        <label htmlFor="otherPartyInput">Who are you speaking to: </label>
        <input id = "otherPartyInput" 
        name = "otherPartyInput" 
        type = "text"
        value = {formData.otherPartyInput}
        onChange= {handleChange}
        placeholder = "eg. Manager"/>
        </div>

          <div className = "form-field">
        <label htmlFor="descriptionInput">Describe the situation at hand:  </label>
        <textarea
         id = "descriptionInput" 
        name = "descriptionInput" 
        value = {formData.descriptionInput}
        onChange= {handleChange}
        placeholder = "eg. Asking for an extension for a deadline"/>
        
        </div>
        </div>
    );
};

export default Form;