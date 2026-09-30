import { Link } from "react-router-dom";
import { API_URL } from "../api";

const Navbar = ({ user }) => (
  <div className="navbar">
    <Link className="logo" to="/">CC OAuth PassportJS</Link>
    <ul className="list">
      {user ? (
        <>
          {user.photo && <li className="listItem"><img src={user.photo} alt="" className="avatar" /></li>}
          <li className="listItem">{user.name}</li>
          <li className="listItem">
            <a className="link" href={`${API_URL}/auth/logout`}>Logout</a>
          </li>
        </>
      ) : (
        <li className="listItem"><Link className="link" to="/login">Login</Link></li>
      )}
    </ul>
  </div>
);

export default Navbar;
