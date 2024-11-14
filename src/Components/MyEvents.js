import React, { useState, useEffect } from "react";
import { firestore, auth } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const MyEvents = () => {
    const [myEvents, setMyEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth.currentUser) {
            console.log("No user signed in.");
            setLoading(false);
            return;
        }

        const fetchMyEvents = () => {
            const userEmail = auth.currentUser.email;
            const eventsRef = collection(firestore, "events");
            const q = query(eventsRef, where("attendees", "array-contains", userEmail));

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const eventsList = querySnapshot.docs.map(doc => doc.data());
                setMyEvents(eventsList);
                setLoading(false);
            });

            return unsubscribe;
        };

        fetchMyEvents();
    }, []);

    if (loading) {
        return <div>Loading your events...</div>;
    }

    return (
        <div className="my-events-container">
            <h2>You are attending the following events:</h2>
            {myEvents.length === 0 ? (
                <p className="no-events-message">You are not attending any events yet.</p>
            ) : (
                <ul className="event-list">
                    {myEvents.map((event, index) => (
                        <li key={index}>
                            <h3>{event.title}</h3>
                            <p>Date & Time: {event.dateTime}</p>
                            <p>Location: {event.location}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyEvents;