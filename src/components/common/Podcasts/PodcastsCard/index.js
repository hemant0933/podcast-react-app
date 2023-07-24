import React from 'react';
import './style.css'
import { Link } from 'react-router-dom';

const PodcastsCard = ({id, title,displayImage}) => {
  return (
   <Link style={{textDecoration:'none'}} to={`/podcast/${id}`}>
    <div className='podcast_Card'>
     <img className='displayImgPodcast' src={displayImage} alt={title}/>
     <p className='title_podcast'>{title}</p>
    </div>
   </Link>
  );
}

export default PodcastsCard;
