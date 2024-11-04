import React, { useState } from 'react';
import '../Style.css';
import Header from './Header';
import { GoogleMap, LoadScript, Autocomplete, Marker } from '@react-google-maps/api';
import { ref, set } from "firebase/database";
import { database } from '../firebase';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const EventFeed = () => {

    const [location, setLocation] = useState('');
    const [autocomplete, setAutocomplete] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    
    const storage = getStorage();
    
    return (
        <div>
            <Header />
            <h1>Events</h1>
        </div>  
    )
    }

export default EventFeed;