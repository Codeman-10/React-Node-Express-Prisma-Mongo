import { Component, useContext, useState } from "react";
import "./login.scss";
import { Link, json, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
function Login() {
  const { currentUser } = useContext(AuthContext)

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { updateUser } = useContext(AuthContext)
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");
    try {
      setLoading(true);

      const res = await apiRequest.post("auth/login", {
        username, password
      })

      // localStorage.setItem("user",JSON.stringify(res.data));
      updateUser(res.data)
      console.log(res)
      navigate("/")
    }
    catch (err) {
      console.log(err)
      setError(err.response?.data?.message);
    }
    finally {
      setLoading(false);
    }
  }
  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <input name="username" type="text" placeholder="Username" />
          <input name="password" type="password" placeholder="Password" />
          <button disabled={loading}>Login</button>
          <Link to="/register">{"Don't"} you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Login;
