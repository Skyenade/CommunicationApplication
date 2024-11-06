import React, { useState, useEffect } from 'react';
import '../Style.css';
import Header from './Header';
import { ref, onValue } from "firebase/database";
import { database } from '../firebase';

const EventFeed = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const eventsRef = ref(database, 'events');
    onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const eventsList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setEvents(eventsList);
      } else {
        setEvents([]);
      }
    });
  }, []);

  return (
    <div>
      <Header />
      <h1>Event Feed</h1>
      <div className="event-feed">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="event-card">
              <h2>{event.title}</h2>
              <p><strong>Date & Time:</strong> {new Date(event.dateTime).toLocaleString()}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Details:</strong> {event.details}</p>
              {event.imageUrl && (
                <img src={event.imageUrl} alt={event.title} className="event-image" />
              )}
              {/* {event.coordinates && (
                <div className="event-coordinates">
                  <p><strong>Coordinates:</strong> {event.coordinates.lat}, {event.coordinates.lng}</p>
                </div>
              )} */}
            </div>
          ))
        ) : (
          <p>No events to show.</p>
        )}
      </div>
    </div>
  );
};

export default EventFeed;
