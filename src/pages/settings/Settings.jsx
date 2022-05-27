import { useContext, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./settings.css";
import { Context } from "../../context/Context";
import axios from "axios";

const Settings = () => {
  const { user, dispatch } = useContext(Context);
  const PF = "/images/";
  // const PF = "http://localhost:3001/images/";

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [file, setFile] = useState(null);
  const [inputs, setInputs] = useState(user);

  const handleChange = (e) => {
    e.preventDefault();
    setInputs((prev) => {
      return { ...prev, [e?.target?.name]: e.target.value };
    });
  };
  const updatedUser = {
    userId: user._id,
    ...inputs,
  };

  console.log(updatedUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "UPDATE_START" });

    if (file) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append("name", filename);
      data.append("file", file);
      updatedUser.profilePic = filename;
      try {
        await axios.post("/api/upload", data);
      } catch (error) {}
    }

    try {
      const res = await axios.put(`/api/users/${user._id}`, updatedUser);
      setSuccess(true);
      dispatch({ type: "UPDATE_SUCCESS", payload: res.data });
    } catch (error) {
      dispatch({ type: "UPDATE_FAILURE" });
    }
  };
  return (
    <div className="settings">
      <div className="settingsWrapper">
        <div className="settingsTitle">
          <span className="settingsUpdateTitle">Update Your Account</span>
          <span className="settingsDeleteTitle">Delete Account</span>
        </div>
        <form onSubmit={handleSubmit} className="settingsForm">
          <label htmlFor="">Profile Picture</label>
          <div className="settingsPP">
            <img
              src={file ? URL.createObjectURL(file) : PF + user.profilePic}
              alt=""
            />
            <label htmlFor="fileInput">
              <i className="settingsPPIcon far fa-user-circle "></i>
            </label>
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
              name="file"
            />
          </div>

          <label htmlFor="">Username</label>
          <input
            type="text"
            defaultValue={user.username}
            // onChange={(e) => setUsername(e.target.value)}
            onChange={handleChange}
            name="username"
          />
          <label htmlFor="">Email</label>
          <input
            type="email"
            defaultValue={user.email}
            // onChange={(e) => setEmail(e.target.value)}
            onChange={handleChange}
            name="email"
          />
          <label htmlFor="">Password</label>
          <input
            type="password"
            // onChange={(e) => setPassword(e.target.value)}
            onChange={handleChange}
            name="password"
          />
          <button type="submit" className="settingsSubmit">
            Update
          </button>
          {success && (
            <span
              style={{ color: "green", textAlign: "center", marginTop: "20px" }}
            >
              Profile has been updated...
            </span>
          )}
        </form>
      </div>
      <Sidebar />
    </div>
  );
};

export default Settings;
