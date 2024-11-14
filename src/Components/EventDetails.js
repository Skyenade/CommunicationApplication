import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import Header from "../Components/Header";
import "../Style.css";

const EventDetails = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (!eventId) {
            console.error("No event ID provided.");
            return;
        }

        const fetchEvent = async () => {
            try {
                const eventDoc = doc(firestore, "events", eventId);
                const docSnapshot = await getDoc(eventDoc);

                if (docSnapshot.exists()) {
                    setEvent(docSnapshot.data());
                } else {
                    console.log("No such event!");
                }
            } catch (error) {
                console.error("Error fetching event:", error);
            }
        };

        // Fetch comments related to the event
        const fetchComments = () => {
            if (!eventId) {
                console.error("Event ID is still undefined in fetchComments.");
                
                return;
            }
            const commentsCollection = collection(firestore, "comments");
            const commentsQuery = query(
            commentsCollection, 
                where("eventId", "==", eventId), 
                orderBy("timestamp", "desc")
            );
           
            const unsubscribe = onSnapshot(commentsQuery, (commentsSnapshot) => {
                const commentsList = commentsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setComments(commentsList);
            });

            return unsubscribe;
        };
        fetchEvent();
        const unsubscribeComments = fetchComments();

        return () => unsubscribeComments && unsubscribeComments(); // Clean up listener on unmount
    }, [eventId]);

    if (!event) {
        return <div>Loading event details...</div>;
    }

    return (
        <div>
            <Header />
            <div className="event-details">
                <h1 className="title">{event.title}</h1>
                <h2 className="event-header">Event Created by: {event.createdBy}</h2>
                <h3 className="event-header">Date & Time: {new Date(event.dateTime).toLocaleString()}</h3>

                <div className="attend-event">
                    <input type="checkbox" id="attendEvent" />
                    <label htmlFor="attendEvent">Attend this event</label>

                    <input type="checkbox" id="reportEvent" />
                    <label htmlFor="reportEvent">Report event</label>
                </div>

                <div className="attendees-list">
                    <h3>List of Attendees</h3>
                    <ul>
                        <li>John Doe</li>
                        <li>Jane Smith</li>
                        <li>Michael Brown</li>
                        <li>Emily Davis</li>
                    </ul>
                </div>

                <div className="event-image">
                    {event.images && event.images.length > 0 && (
                        <img src={event.images[0]} alt={event.title} />
                    )}
                </div>

                <div className="event-details-text">
                    <h4>Event Details</h4>
                    <p>{event.details}</p>
                </div>

                <div className="event-map">
                    {/* Display map or location image if available */}
                    {event.locationImage && (
                        <img src={event.locationImage} alt="Event Map" />
                    )}
                </div>

                <div className="comments-section">
                    <h4>Comments</h4>
                    {/* Map and display comments here if needed */}
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
