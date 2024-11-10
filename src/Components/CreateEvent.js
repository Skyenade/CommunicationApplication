import React, { useState } from 'react';
import '../Style.css';
import Header from './Header';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import { ref, set } from "firebase/database";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, database } from '../firebase';


const CreateEvent = () => {
  const [dateTime, setDateTime] = useState('');
  const [location, setLocation] = useState('');
  const [autocomplete, setAutocomplete] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDetails, setEventDetails] = useState('');
  const [eventImages, setEventImages] = useState([]);
  const firestore = getFirestore();
  const storage = getStorage();

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const imageUrls = [];

      for (const image of eventImages) {
        const imageRef = storageRef(storage, 'eventImages/' + image.name);
        await uploadBytes(imageRef, image);
        const url = await getDownloadURL(imageRef);
        imageUrls.push(url);
      }

      const newEvent = {
        title: eventTitle,
        dateTime,
        location,
        coordinates: selectedLocation,
        details: eventDetails,
        images: imageUrls, // Store the URLs in Firestore
        createdBy: auth.currentUser?.uid || "Anonymous",
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
      <Header/>
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
