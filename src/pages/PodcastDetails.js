import React, { useEffect, useState } from "react";
import Header from "../components/common/Header";
import { useNavigate, useParams } from "react-router-dom";
import { collection, doc, getDoc, onSnapshot, query } from "firebase/firestore";
import { toast } from "react-toastify";
import { auth, db } from "../firebase";
import Button from "../components/common/Button";
import EpisodeDetail from "../components/common/Podcasts/EpisodeDetail";
import AudioPlayer from "../components/common/Podcasts/AudioPlayer";

const PodcastDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [podcast, setPodcast] = useState({});
  const [episodes, setEpisodes] = useState("");
  const [PlayingFile, setPlayingFile] = useState();

  console.log("ID", id);

  console.log(podcast);

  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);

  const getData = async () => {
    try {
      const docRef = doc(db, "podcasts", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setPodcast({ id: id, ...docSnap.data() });
        // toast.success("Podcast Found!");
      } else {
        console.log("No such document!");
        toast.error("No such document!");
        navigate("/podcasts");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "podcasts", id, "episodes")),
      (querySnapshot) => {
        const episodesData = [];
        querySnapshot.forEach((doc) => {
          episodesData.push({ id: doc.id, ...doc.data() });
        });
        setEpisodes(episodesData);
      },
      (error) => {
        console.log("Error fetching episodes:", error);
      }
    );
    return () => {
      unsubscribe();
    };
  }, [id]);

  return (
    <div>
      <Header />
      <div className="input_Wrapper">
        {podcast.id && (
          <div className="podcastDetail_Wrapper">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <h1 className="podcast_title_heading">{podcast.title}</h1>
              {podcast.createdBy === auth.currentUser.uid && (
                <Button
                  width={"300px"}
                  text={"Create Episode"}
                  onClick={() => {
                    navigate(`/podcast/${id}/create-episode`);
                  }}
                />
              )}
            </div>
            <div className="banner_Wrapper">
              <img src={podcast.bannerImage} alt="" />
            </div>
            <p className="podcast_desc">{podcast.description}</p>
            <h1 className="podcast_title_heading">Episode</h1>
            {episodes.length > 0 ? (
              <>
                {episodes.map((episode, index) => {
                  return (
                    <EpisodeDetail
                      key={index}
                      index={index + 1}
                      title={episode.title}
                      description={episode.description}
                      audioFile={episode.audioFile}
                      onClick={(file) => setPlayingFile(file)}
                    />
                  );
                })}
              </>
            ) : (
              <p>No Episodes</p>
            )}
          </div>
        )}
      </div>
      {PlayingFile && (
        <AudioPlayer audioSrc={PlayingFile} image={podcast.displayImageUrl} />
      )}
    </div>
  );
};

export default PodcastDetails;
