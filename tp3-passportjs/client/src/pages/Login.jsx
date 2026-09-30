import { API_URL } from "../api";

const Login = () => {
  const openProvider = (provider) => {
    window.open(`${API_URL}/auth/${provider}`, "_self");
  };

  return (
    <div className="login">
      <h1>Se connecter</h1>
      <div className="wrapper">
        <div className="card google" onClick={() => openProvider("google")}>
          <span>Se connecter avec Google</span>
        </div>
        <div className="card github" onClick={() => openProvider("github")}>
          <span>Se connecter avec GitHub</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
