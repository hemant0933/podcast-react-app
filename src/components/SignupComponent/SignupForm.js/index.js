import React, { useState } from "react";
import InputComponent from "../../common/input";
import Button from "../../common/Button";

import { auth, db, storage } from "../../../firebase";
import {createUserWithEmailAndPassword} from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setUser } from "../../../slice/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FileInput from "../../common/input/FileInput";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const SignupForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignUp = async () => {
    setLoading(true);
    // console.log("Handling Signup...");
    if (password === confirmPassword && password.length >= 6 && avatar) {
      try {
         // Creating a new user
        const useCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
          avatar
        );
        const user = useCredential.user;
        // console.log("User", user);
        // upload file -->  get downloadable links
        const avatarRef = ref(
          storage,
          `profile/${auth.currentUser.uid}/${Date.now()}`
        )
        await uploadBytes(avatarRef, avatar);
        // console.log( uploaded);  
        const avatarUrl = await getDownloadURL(avatarRef);
      
        // Save the user's details to a Firestore collection
        await setDoc(doc(db, "users", user.uid), {
          name: fullName,
          email: user.email,
          uid: user.uid,
          avatar:avatarUrl,
        });
       
        //saving data in the redux, call the redux action
        dispatch(
          setUser({
            name: fullName,
            email: user.email,
            uid: user.uid,
            avatar: avatarUrl,
          })
        );
        setLoading(false);
        navigate("/profile");
      } catch (err) {
          setLoading(false);
          console.error("Error", err.message);
          toast.error(err.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
      }
    } else {
      setLoading(false);
      if (password !== confirmPassword) {
        toast.error("Passwords don’t match.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else if (password.length < 6) {
        toast.error("Password too short.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
      //throw an error
    }
  };

  const handleProfileImage = (file) =>{
    setAvatar(file)
  };

  return (
    <>
      <InputComponent
        state={fullName}
        setState={setFullName}
        type="text"
        placeholder="Full Name"
        required={true}
      />
      <InputComponent
        state={email}
        setState={setEmail}
        type="email"
        placeholder="Email"
        required={true}
      />
      <InputComponent
        state={password}
        setState={setPassword}
        type="password"
        placeholder="Password"
        required={true}
      />
      <InputComponent
        state={confirmPassword}
        setState={setConfirmPassword}
        type="password"
        placeholder="Confirm Password"
        required={true}
      />
      <FileInput
        accept={"image/*"}
        id="Avatar-id"
        fileHandleFunc={handleProfileImage}
        text={"Upload Profile Photo"}
     />
      <Button
        text={loading ? "Loading..." : "Signup"}
        onClick={handleSignUp}
        disabled={loading}
      />
    </>
  );
};

export default SignupForm;
