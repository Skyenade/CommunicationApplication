import React, { useState } from 'react';
import '../Style.css';
import Header from './Header';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import { ref, set } from "firebase/database";
import { database } from '../firebase';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const CreateEvent = () => {
  const [dateTime, setDateTime] = useState('');
  const [location, setLocation] = useState('');
  const [autocomplete, setAutocomplete] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDetails, setEventDetails] = useState('');
  const [eventImage, setEventImage] = useState(null);
  const [eventImageUrl, setEventImageUrl] = useState('');
  const storage = getStorage();

  const handleDateTimeChange = (event) => {
    setDateTime(event.target.value);
  };

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
    if (e.target.files[0]) {
      setEventImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let imageUrl = '';
    if (eventImage) {
      const imageRef = storageRef(storage, 'eventImages/' + eventImage.name);
      await uploadBytes(imageRef, eventImage);
      imageUrl = await getDownloadURL(imageRef);
      setEventImageUrl(imageUrl);
    }

    const eventData = {
      title: eventTitle,
      dateTime,
      location,
      coordinates: selectedLocation,
      details: eventDetails,
      imageUrl: imageUrl,
    };

    const eventRef = ref(database, 'events/' + Date.now());
    await set(eventRef, eventData)
      .then(() => {
        alert('Event created successfully!');
        setEventTitle('');
        setDateTime('');
        setLocation('');
        setSelectedLocation(null);
        setEventDetails('');
        setEventImage(null);
        setEventImageUrl('');
      })
      .catch((error) => {
        console.error('Error saving event:', error);
      });
  };

  return (
    <div >
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
