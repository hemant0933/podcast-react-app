import React, { useEffect, useState } from "react";
import Header from "../components/common/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import InputComponent from "../components/common/input";
import Button from "../components/common/Button";
import FileInput from "../components/common/input/FileInput";
import { toast } from "react-toastify";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection} from "firebase/firestore";

const CreateAnEpisodePage = () => {
  const {id} = useParams();  
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [audioFile, setAudioFile] = useState([]);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const audioFileHandle = async (file) => {
    setAudioFile(file);
  };
  const handleSubmit = async() => {
    if ((title, desc, audioFile)) {
      try {
        setLoading(true);
        const audioRef = ref(
            storage,
            `podcast-episodes/${auth.currentUser.uid}/${Date.now()}`
        );
        await uploadBytes(audioRef, audioFile);

        const audioURL = await getDownloadURL(audioRef);
        const episodesData = {
            title:title,
            description: desc,
            audioFile: audioURL,
        };

        await addDoc(
            collection(db, "podcasts", id, "episodes"),
            episodesData
        );
        toast.success("episode created succesfully")
        setLoading(false)
        navigate(`/podcast/${id}`);
        setTitle("");
        setDesc("");
        setAudioFile("");

      } catch (e) {
        setLoading(false)
        toast.error(e.message);
      }
    } else {
      setLoading(false)
      toast.error("All files should be there");
    }
  };
 
  return (
    <div>
      <Header />
      <div className="input_Wrapper">
        <h1>Create Episode</h1>
        <InputComponent
          state={title}
          setState={setTitle}
          type="text"
          placeholder="Title"
          required={true}
        />
        <InputComponent
          state={desc}
          setState={setDesc}
          type="text"
          placeholder="Description"
          required={true}
        />
        <FileInput
          accept={"audio/*"}
          id="audio-file-input"
          fileHandleFunc={audioFileHandle}
          text={"Upload Audio File"}
        />
        <Button
          text={loading ? "Loading..." : "Create Episode"}
          onClick={handleSubmit}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default CreateAnEpisodePage;
