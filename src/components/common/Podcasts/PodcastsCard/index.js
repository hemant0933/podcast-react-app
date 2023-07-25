import React from 'react';
import './style.css'
import { Link } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa6';

const PodcastsCard = ({id, title,displayImage}) => {
  return (
   <Link style={{textDecoration:'none'}} to={`/podcast/${id}`}>
    <div className='podcast_Card'>
     <img className='displayImgPodcast' src={displayImage} alt={title}/>
      <div style={{display:'flex', justifyContent:'space-between',alignItems:'center'}}>
      <p className='title_podcast'>{title}</p>
     <span className='playIcon'><FaPlay/></span>
      </div>
    </div>
   </Link>
  );
}

export default PodcastsCard;
