import React, { useState } from 'react';
import '../Style.css';
import Header from './Header';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { auth, database } from '../firebase';
import { ref, get } from 'firebase/database';

const CreateEvent = () => {
  const [dateTime, setDateTime] = useState('');
  const [location, setLocation] = useState('');
  const [autocomplete, setAutocomplete] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDetails, setEventDetails] = useState('');
  const [eventImages, setEventImages] = useState([]);
  const firestore = getFirestore();

  const handleDateTimeChange = (event) => setDateTime(event.target.value);

  const onLoad = (autoC) => setAutocomplete(autoC);

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      setLocation(place.formatted_address || place.name);
      setSelectedLocation({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      setEventImages(Array.from(e.target.files));
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const imageBase64List = [];
      
      for (const image of eventImages) {
        const base64String = await convertToBase64(image);
        imageBase64List.push(base64String);
      }
  
      const userRef = ref(database, `users/${auth.currentUser?.email.replace('.', ',')}`);
      const userSnapshot = await get(userRef);
  
      const createdBy = userSnapshot.exists() ? userSnapshot.val().username : auth.currentUser?.email;
  
      const newEvent = {
        title: eventTitle,
        dateTime,
        location,
        coordinates: selectedLocation,
        details: eventDetails,
        images: imageBase64List,
        createdBy: createdBy,
        report: false,
        warning: false,
        suspended: false, 
        likes: [],
        comments: [], 
        comment: "", 
      };
  
      await addDoc(collection(firestore, "events"), newEvent);
  
      alert('Event created successfully!');
      setEventTitle('');
      setDateTime('');
      setLocation('');
      setSelectedLocation(null);
      setEventDetails('');
      setEventImages([]);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };
  

  return (
    <div>
      <Header />
      <div className='create-event'>
        <h1 className="create-event-heading">Create Event</h1>
        <form className="create-event-form" onSubmit={handleSubmit}>
          <div className='create-event-input-container'>
            <label className="create-event-label">Event Title: </label>
            <input
              className="create-event-input"
              type="text"
              placeholder="Event Title"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              required
            />

            <label className="create-event-label">Event Date and Time: </label>
            <input
              className="create-event-input"
              type="datetime-local"
              value={dateTime}
              onChange={handleDateTimeChange}
              required
            />
          </div>

          <div className='create-event-input-container'>
            <label className="create-event-label">Event Image: </label>
            <input
              className="create-event-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              multiple
              required
            />

            <label className="create-event-label">Event Location: </label>
            <LoadScript googleMapsApiKey="AIzaSyBqwTateOoIdBOshwiWfGVfbGMcgnAl2KM" libraries={["places"]}>
              <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <input
                  className="create-event-input"
                  type="text"
                  placeholder="Event Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </Autocomplete>
            </LoadScript>
          </div>

          <div className='create-event-input-container'>
            <label className="create-event-label">Event Details: </label>
            <textarea
              className="create-event-textarea"
              type="text"
              placeholder="Event Details"
              value={eventDetails}
              onChange={(e) => setEventDetails(e.target.value)}
              required
            />
          </div>

          <button className="create-event-button" type="submit">Create Event</button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
