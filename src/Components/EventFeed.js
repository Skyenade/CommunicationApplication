import React, { useState, useEffect } from 'react';
import '../Style.css';
import { collection, getDocs } from "firebase/firestore";
import { firestore } from '../firebase';

const EventFeed = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsCollection = collection(firestore, 'events');
        const eventsSnapshot = await getDocs(eventsCollection);
        const eventsList = eventsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEvents(eventsList);
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <div className="event-feed">
        <h1 className='home-heading'>Event Feed</h1>
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="event-card">
              <h2>{event.title}</h2>
              <p><strong>Date & Time:</strong> {new Date(event.dateTime).toLocaleString()}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Details:</strong> {event.details}</p>
              {event.images && event.images.length > 0 && (
                <img src={event.images[0]} alt={event.title} className="event-image" />
              )}              
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
