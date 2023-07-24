import React from 'react';
import Header from '../components/common/Header';
import CreateAPodcastForm from '../components/CreateAPodcast/CreateAPodcastForm';

const CreateAPodcast = () => {
  return (
    <div>
        <Header/>
      <div className='input_Wrapper'>
        <h1>Create a Podcast</h1>
        <CreateAPodcastForm/>
      </div>
    </div>
  );
}

export default CreateAPodcast;
