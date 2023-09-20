import React, { useEffect, useState } from "react";
import Header from "../components/common/Header";
import {
  // QuerySnapshot,
  collection,
  onSnapshot,
  query,
} from "firebase/firestore";
import { db } from "../firebase";
import { setPodcasts } from "../slice/podcastSlice";
import { useDispatch, useSelector } from "react-redux";
import PodcastsCard from "../components/common/Podcasts/PodcastsCard";
import InputComponent from "../components/common/input";

const PodcastsPage = () => {
  const podcasts = useSelector((state) => state.podcasts.podcasts);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "podcasts")),
      (querySnapshot) => {
        const podcastsData = [];
        querySnapshot.forEach((doc) => {
          podcastsData.push({ id: doc.id, ...doc.data() });
        });
        dispatch(setPodcasts(podcastsData));
      },
      (error) => {
        console.error("Error fetching podcasts:", error);
      }
    );
    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  var filteredPodcasts = podcasts.filter((item) => 
  item.title.trim().toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <Header />
      <div style={{ marginTop: "2rem" }} className="input_Wrapper">
        <h1>Discover Podcasts</h1>
        <InputComponent 
        state={search} 
        setState={setSearch}
        type='text'
        placeholder="Search By Title"
      />
        {filteredPodcasts.length > 0 ? 
        <div className="podcasts_Flex" style={{marginTop:'1.5rem'}}>{
            filteredPodcasts.map((item) => {
                return <PodcastsCard
                            key={item.id} 
                            id={item.id} 
                            title={item.title} 
                            displayImage={item.displayImageUrl}
                        />;
            })
        }</div> :
         <>No Current Podcast</>}
      </div>
    </div>
  );
};

export default PodcastsPage;
