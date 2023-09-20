import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/common/Header";
import Button from "../components/common/Button";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { auth, db, storage } from "../firebase";
import Loader from "../components/common/Loader";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import FileInput from "../components/common/input/FileInput";
import InputComponent from "../components/common/input";
import { setUser } from "../slice/userSlice";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Profile = () => {
  const [avatar, setAvatar] = useState("");
  const [Isedit, setIsEdit] = useState(false);
  const [newEmail, setnewEmail] = useState("");
  const [newAvatar, setnewAvatar] = useState("");
  const [newName, setnewName] = useState("");

  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();


  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        toast.success("User logged out!");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handlNewProfileImage = (e) => {
    setnewAvatar(e.target.files[0]);
  };
  const handleEdit = () => {
    setIsEdit(true);
    setnewName(user.name);
    setnewEmail(user.email);
  };

  const handleSave = async () => {
    // Upload new profile picture to firbase storage
    let newAvatarUrl = avatar;
    if (newAvatar) {
      const avatarRef = ref(
        storage,
        `profile/${auth.currentUser.uid}/${Date.now()}`
      );
      await uploadBytes(avatarRef, newAvatar);
      newAvatarUrl = await getDownloadURL(avatarRef);
    }

    //Update user Data in firestore
    const userDoc = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userDoc, {
      name: newName,
      email: newEmail,
      avatar: newAvatarUrl,
    });
    // update local state
    dispatch(
      setUser({
        name: newName,
        email: newEmail,
        uid: user.uid,
        avatar: newAvatarUrl,
      })
    );
    setAvatar(newAvatarUrl);
    setIsEdit(false);
  };

  useEffect(() => {
    const getUserData = async () => {
      const userDoc = doc(db, "users", auth.currentUser.uid);
      const userData = await getDoc(userDoc);
      if (userData.exists()) {
        setAvatar(userData.data().avatar);
         // Store user data in local storage
      localStorage.setItem('user', JSON.stringify(userData.data()));
      }
    };
    getUserData();
  },[]);     //eslint-disable-line
  useEffect(() => {
    // Get user data from local storage
    const storedUserData = localStorage.getItem('user');
    if (storedUserData) {
      dispatch(setUser(JSON.parse(storedUserData)));
    }
  }, []);  //eslint-disable-line

  if (!user) {
    return <Loader />;
  }
  // console.log(user);

  if (Isedit) {
    return (
      <div>
        <Header />
        <div className="wrapper">
          <h1>Update User Data</h1>
          <InputComponent
            state={newName}
            setState={setnewName}
            type="text"
            placeholder="Full Name"
            required={true}
          />
          <InputComponent
            state={newEmail}
            setState={setnewEmail}
            type="email"
            placeholder="Email"
            required={true}
          />
          {/* Add input for profile picture */}
          <FileInput
            accept={"image/*"}
            id="Avatar-id"
            fileHandleFunc={handlNewProfileImage}
            text={"Upload Profile Photo"}
          />
          <Button text={"Save"} onClick={handleSave} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="wrapper">
        <img src={avatar} className="avatar" alt="profile" />
        <p style={{ textTransform: "capitalize" }}>User Name :- {user && user.name}</p>
        <p>Email :- {user && user.email}</p>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <Button width="100px" text={"Edit"} onClick={handleEdit} />
            <Button width="100px" text={"Logout"} onClick={handleLogout} />
          </div>
      </div>
    </div>
  );
};

export default Profile;
