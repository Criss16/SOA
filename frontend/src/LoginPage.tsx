import {ChangeEvent, useState} from "react";
import {useAuth} from "./AuthContext.tsx";
import {useNavigate} from "react-router-dom";

const LoginPage = ()=> {
    const [inputValueEmail, setInputValueEmail] = useState('');
    const [inputValuePassword, setInputValuePassword] = useState('');

    const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValueEmail(event.target.value);
    };

    const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValuePassword(event.target.value);
    };

    const auth = useAuth();
    const navigate = useNavigate();

    const handleSubmit = () => {
        fetch("http://localhost/auth/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email: inputValueEmail, password: inputValuePassword}),
        }). then((response) => {
            if (response.status === 200) {
                response.json().then(data => {
                    auth.setToken(data.token);
                    auth.setIsAuthenticated(true);
                    navigate("/");
                });
            }
            if (response.status === 401) {
                alert("Invalid credentials");
            }
        }).catch((error) => {
            console.log(error);
            alert("Invalid credentials");
        })
    };

    return (
        <div>
            <label htmlFor="textInput">Email: </label>
            <input
                type="text"
                id="textInput"
                value={inputValueEmail}
                onChange={handleChangeEmail}
                placeholder="Type something..."
            />
            <label htmlFor="textInput">Password: </label>
            <input
                type="text"
                id="textInput"
                value={inputValuePassword}
                onChange={handleChangePassword}
                placeholder="Type something..."
            />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
}

export default LoginPage;