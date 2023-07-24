import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import InputComponent from '../common/input';
import Button from '../common/Button';
import { toast } from 'react-toastify';
import FileInput from '../common/input/FileInput';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '../../firebase';
import { addDoc, collection} from 'firebase/firestore';

const CreateAPodcastForm = () => {

    const [title, setTitle] =useState("")
    const [desc, setDesc] =useState("")
    const [displayImage, setDisplayImage] =useState("")
    const [bannerImage, setBannerImage] =useState("")
    
    const [loading, setLoading] =useState(false);
  
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async () => {
        if(title && desc && displayImage && bannerImage){
            setLoading(true);
            try{
                 //  1. Upload File -> get downloadable links 
                const bannerImageRef = ref(
                    storage,
                    `podcasts/${auth.currentUser.uid}/${Date.now()}`
                );
                
                await uploadBytes(bannerImageRef, bannerImage);
                //    console.log( uploaded);

                const bannerImageUrl = await getDownloadURL(bannerImageRef);
                // console.log("banner Image", bannerImageUrl);

                const displayImageRef = ref(
                    storage,
                    `podcasts/${auth.currentUser.uid}/${Date.now()}`
                );
                await uploadBytes(displayImageRef, displayImage);
                //    console.log( uploaded);  
                const displayImageUrl = await getDownloadURL(displayImageRef);
                // console.log("banner Image", bannerImageUrl);

            //    2. create a new doc in a new collection called podcasts
                    const podcastData = {
                        title: title,
                        description: desc,
                        bannerImage: bannerImageUrl,
                        displayImageUrl: displayImageUrl,
                        createdBy: auth.currentUser.uid,
                    };
                const docRef = await addDoc(collection(db,"podcasts"),podcastData)
                
                    // Redirect to the podcast details page
                    setTitle("");
                    setDesc("");
                    setBannerImage("");
                    setDisplayImage("");
                    toast.success("Podcast Created Successful!", {
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
                toast.error("File not Uploaded", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    });
                console.log(e);
                setLoading(false);
            }
     
        //    3. save this new podcast episodes states in our podcasts
        }
        else {
            toast.error("Please fill valid details!", {
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

    const HandleBannerImage = (file) => {
        setBannerImage(file);
    }

    const HandleDisplayImage = (file) => {
        setDisplayImage(file);
    }
  return (
    <>
      <InputComponent 
        state={title} 
        setState={setTitle}
        type='text'
        placeholder="Title"
        required={true}
      />
      <InputComponent 
        state={desc} 
        setState={setDesc}
        type='text'
        placeholder="Description"
        required={true}
      />
     <FileInput
        accept={"image/*"}
        id="Display-id"
        fileHandleFunc={HandleDisplayImage}
        text={"Display Image Upload"}
     />
     <FileInput
        accept={"image/*"}
        id="banner-id"
        fileHandleFunc={HandleBannerImage}
        text={"Banner Image Upload"}
     />
      <Button text={loading ? "Loading...": "Create Podcast"} onClick={handleSubmit} disabled={loading}/>
    </>
  );
}

export default CreateAPodcastForm;
