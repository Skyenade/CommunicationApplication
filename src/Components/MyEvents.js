import React, { useState, useEffect } from "react";
import { firestore, auth, database } from "../firebase";
import { ref, get } from "firebase/database";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import './MyEvents.css';

const MyEvents = () => {
    const [username, setUsername] = useState("");
    const [createdEvents, setCreatedEvents] = useState([]);
    const [attendingEvents, setAttendingEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsernameAndEvents = async () => {
            if (!auth.currentUser) {
                console.log("No user signed in.");
                setLoading(false);
                return;
            }
    
            const userEmail = auth.currentUser.email;
    
            try {
                const userRef = ref(database, "users");
                const snapshot = await get(userRef);
    
                if (snapshot.exists()) {
                    const usersData = snapshot.val();
                    const userEntry = Object.values(usersData).find(
                        (user) => user.email === userEmail
                    );
    
                    if (userEntry && userEntry.username) {
                        const fetchedUsername = userEntry.username;
                        setUsername(fetchedUsername);
    
                        const eventsRef = collection(firestore, "events");
                        const createdQuery = query(eventsRef, where("createdBy", "==", fetchedUsername));
                        onSnapshot(createdQuery, (querySnapshot) => {
                            const createdList = querySnapshot.docs.map((doc) => ({
                                id: doc.id,
                                ...doc.data(),
                            }));
                            setCreatedEvents(createdList);
                        });
    
                        const attendingQuery = query(eventsRef, where("attendees", "array-contains", userEmail));
                        onSnapshot(attendingQuery, (querySnapshot) => {
                            const attendingList = querySnapshot.docs.map((doc) => ({
                                id: doc.id,
                                ...doc.data(),
                            }));
                            setAttendingEvents(attendingList);
                        });
                    } else {
                        console.error("User not found in the Realtime Database.");
                    }
                } else {
                    console.error("Users node does not exist in the Realtime Database.");
                }
            } catch (error) {
                console.error("Error fetching user data or events:", error);
            }
    
            setLoading(false);
        };
    
        fetchUsernameAndEvents();
    }, []);
    

    if (loading) {
        return <div>Loading your events...</div>;
    }

    const handleEventDetailsClick = (eventId) => {

        navigate(`/event/${eventId}`);
    };

    return (
        <div>
            <Header />
            <div className="my-events-container">
                <div className="events-section">
                    <h2>Your Created Events</h2>
                    {createdEvents.length === 0 ? (
                        <p className="no-events-message">You have not created any events yet.</p>
                    ) : (
                        <ul className="event-list">
                            {createdEvents.map((event) => (
                                <li key={event.id}>
                                    <h3>{event.title}</h3>
                                    <p>Date & Time: {event.dateTime}</p>
                                    <p>Location: {event.location}</p>
                                    <button
                                        className="like_btn"
                                        onClick={() => handleEventDetailsClick(event.id)}
                                    >
                                        EventDetails
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="events-section">
                    <h2>Events You're Attending</h2>
                    {attendingEvents.length === 0 ? (
                        <p className="no-events-message">You are not attending any events yet.</p>
                    ) : (
                        <ul className="event-list">
                            {attendingEvents.map((event) => (
                                <li key={event.id}>
                                    <h3>{event.title}</h3>
                                    <p>Date & Time: {event.dateTime}</p>
                                    <p>Location: {event.location}</p>
                                    <button
                                        className="like_btn"
                                        onClick={() => handleEventDetailsClick(event.id)}
                                    >
                                        EventDetails
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyEvents;
