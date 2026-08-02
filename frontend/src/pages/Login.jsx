import {useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import {useAuth} from "../context/AuthContext";

function Login(){
    const navigate = useNavigate();
    const {login} = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            await login(formData);
            navigate("/dashboard");
        } catch (error) {
            alert(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div style={{maxWidth: "400px", margin: "50px auto"}}>
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} /> <br /> <br />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} /> <br /> <br />
                <button type="submit">Login</button>
            </form>

            <br />
            
            <Link to="/register"> Don't have an account? Register</Link>
        </div>
    );
}

export default Login;
