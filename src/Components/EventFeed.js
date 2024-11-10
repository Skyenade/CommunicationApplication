import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Style.css';
import { collection, getDocs } from "firebase/firestore";
import { firestore } from '../firebase'; // Ensure firestore is properly exported from your firebase config

const EventFeed = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();


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

  const handleCommentClick = (eventId) => {
    navigate(`/comments/${eventId}`);
  };

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
              {/* If coordinates are available, you can display them */}
              {/* {event.coordinates && (
                <div className="event-coordinates">
                  <p><strong>Coordinates:</strong> {event.coordinates.lat}, {event.coordinates.lng}</p>
                </div>
              )} */}
        <div>
        <button onClick={() => handleCommentClick(event.id)}>Comment</button>
        </div>
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
