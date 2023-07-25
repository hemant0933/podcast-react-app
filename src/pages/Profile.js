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
      }
    };
    getUserData();
  });

  if (!user) {
    return <Loader />;
  }
  console.log(user);

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
        <h1 style={{ textTransform: "capitalize" }}>{user.name}</h1>
        <h1>{user.email}</h1>
        {/* <h1>{user.uid}</h1> */}
        <Button text={"Edit"} onClick={handleEdit} />
        <Button text={"Logout"} onClick={handleLogout} />
      </div>
    </div>
  );
};

export default Profile;
