import React, { useState } from 'react';
import InputComponent from '../../common/input';
import Button from '../../common/Button';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {auth, db} from "../../../firebase";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../../slice/userSlice';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const LoginFrom = () => {
    const [email, setEmail] =useState("")
    const [password, setPassword] =useState("")
    const [loading, setLoading] =useState(false)

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
        console.log("Handling Login...");

       if(email && password){
        try{
          setLoading(true)
          const useCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password,
          );
          const user =  useCredential.user;

          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userData = userDoc.data(); 
          console.log("userData", userData);

          dispatch(
            setUser({
              name: userData.name,
              email: userData.email,
              uid: user.id,
            })
          )
          navigate("./profile");
          toast.success("Logged in!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            });
            setLoading(false)
        }catch(e){
          console.log("error", e);
          toast.error(e.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            });
            setLoading(false)
        }
       }
       else{
        toast.error("Please fill the details", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });
          setLoading(false)
       }

    }

  return (
    <>
      <InputComponent 
        state={email} 
        setState={setEmail}
        type='email'
        placeholder="Email"
        required={true}
      />
      <InputComponent 
        state={password} 
        setState={setPassword}
        type='password'
        placeholder="Password"
        required={true}
      />
      <Button text={loading ? "Loading...":"Login"} onClick={handleLogin}/>
    </>
  );
}

export default LoginFrom;
