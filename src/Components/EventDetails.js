import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion, setDoc, collection, query, where, onSnapshot, arrayRemove, orderBy } from "firebase/firestore";
import { firestore, auth } from "../firebase";
import Header from "../Components/Header";
import '../Style.css';

const EventDetails = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [comments, setComments] = useState([]);
    const [reportReason, setReportReason] = useState("");
    const [isAttending, setIsAttending] = useState(false);

    const fetchEvent = async (eventId) => {
        try {
            const eventDoc = await getDoc(doc(firestore, 'events', eventId));
            if (eventDoc.exists()) {
                setEvent(eventDoc.data());
                setIsAttending(eventDoc.data().attendees?.includes(auth.currentUser.email));
            } else {
                console.log("No such event!");
            }
        } catch (error) {
            console.error("Error fetching event:", error);
        }
    };

    useEffect(() => {
        if (!eventId) {
            console.error("No event ID provided.");
            return;
        }

        fetchEvent(eventId);

        const eventDocRef = doc(firestore, "events", eventId);
        const unsubscribe = onSnapshot(eventDocRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const eventData = docSnapshot.data();
                setEvent(eventData);
                setIsAttending(eventData.attendees?.includes(auth.currentUser.email));
            } else {
                console.log("No such event!");
            }
        });

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

            const unsubscribeComments = onSnapshot(commentsQuery, (commentsSnapshot) => {
                const commentsList = commentsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setComments(commentsList);
            });

            return unsubscribeComments;
        };

        const unsubscribeComments = fetchComments();

        return () => {
            unsubscribe();
            if (unsubscribeComments) unsubscribeComments(); // Clean up listener on unmount
        };
    }, [eventId]);

    const handleAttendanceChange = async () => {
        const userDocRef = doc(firestore, "users", auth.currentUser.uid);
        const eventDocRef = doc(firestore, "events", eventId);

        if (isAttending) {
            await updateDoc(userDocRef, { attendingEvents: arrayRemove(eventId) });
            await updateDoc(eventDocRef, { attendees: arrayRemove(auth.currentUser.email) });
            setIsAttending(false); // Update state
            window.alert("You are no longer attending this event.");
        } else {
            await updateDoc(userDocRef, { attendingEvents: arrayUnion(eventId) });
            await updateDoc(eventDocRef, { attendees: arrayUnion(auth.currentUser.email) });
            setIsAttending(true); // Update state
            window.alert("You are now attending this event!");
        }
    };

    const handleReportEvent = async () => {
        if (reportReason.trim() === "") {
            window.alert("Please provide a reason for reporting the event.");
            return;
        }

        try {
            const reportData = {
                eventId,
                userId: auth.currentUser.uid,
                userName: auth.currentUser.displayName,
                reason: reportReason,
                timestamp: new Date(),
                status: "flagged"
            };

            await setDoc(doc(firestore, "reports", `${eventId}_${auth.currentUser.uid}`), reportData);
            window.alert("Event reported successfully!");
            setReportReason("");
        } catch (error) {
            console.error("Error reporting event:", error);
            window.alert("Failed to report the event.");
        }
    };

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
                    <input
                        type="checkbox"
                        id="attendEvent"
                        checked={isAttending}
                        onChange={handleAttendanceChange}
                        disabled={isAttending}
                    />
                    <label htmlFor="attendEvent">Attend this event</label>

                    <input
                        type="checkbox"
                        id="reportEvent"
                        onChange={handleReportEvent}
                    />
                    <label htmlFor="reportEvent">Report event</label>
                </div>

                <div className="attendees-list">
                    <h3>List of Attendees</h3>
                    {event.attendees && event.attendees.length > 0 ? (
                        <ul>
                            {event.attendees.map((attendee, index) => (
                                <li key={index}>{attendee}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No attendees yet</p>
                    )}
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
                    {event.locationImage && (
                        <img src={event.locationImage} alt="Event Map" />
                    )}
                </div>

                <div className="comments-section">
                    <h4>Comments </h4>
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <div key={comment.id} className="comment">
                                <p><strong>{comment.userName}</strong> ({new Date(comment.timestamp.seconds * 1000).toLocaleString()}):</p>
                                <p>{comment.text}</p>
                            </div>
                        ))
                    ) : (
                        <p>No comments yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
