import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot, setDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { firestore, auth } from "../firebase";
import Header from "../Components/Header";
import '../Style.css';

const EventDetails = () => {
    const { eventId } = useParams();
    const [user, setUser] = useState("");
    const [event, setEvent] = useState(null);
    const [comments, setComments] = useState([]);
    const [reportReason, setReportReason] = useState("");
    const [isAttending, setIsAttending] = useState(false);

    useEffect(() => {
        if (!eventId) return console.error("No event ID provided.");

        const eventDocRef = doc(firestore, "events", eventId);
        const unsubscribeEvent = onSnapshot(eventDocRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const eventData = docSnapshot.data();
                setEvent(eventData);
                setIsAttending(eventData.attendees?.includes(auth.currentUser.email));
            } else {
                console.log("No such event!");
            }
        });

        const fetchComments = () => {
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
            unsubscribeEvent();
            unsubscribeComments && unsubscribeComments();
        };
    }, [eventId]);

    const handleAttendanceChange = async () => {
        const userDocRef = doc(firestore, "users", auth.currentUser.uid);
        const eventDocRef = doc(firestore, "events", eventId);

        if (isAttending) {
            await updateDoc(userDocRef, { attendingEvents: arrayRemove(eventId) });
            await updateDoc(eventDocRef, { attendees: arrayRemove(auth.currentUser.email) });
            setIsAttending(false);
            window.alert("You are no longer attending this event.");
        } else {
            await updateDoc(userDocRef, { attendingEvents: arrayUnion(eventId) });
            await updateDoc(eventDocRef, { attendees: arrayUnion(auth.currentUser.email) });
            setIsAttending(true);
            window.alert("You are now attending this event!");
        }
    };

    const handleReportEvent = async () => {
        if (!auth.currentUser) return window.alert("You must be logged in to report an event.");
        if (reportReason.trim() === "") return window.alert("Please provide a reason for reporting the event.");

        try {
            const reportData = {
                eventId,
                userId: auth.currentUser.uid,
                userName: auth.currentUser.displayName,
                email: auth.currentUser.email,
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

    if (!event) return <div>Loading event details...</div>;

    return (
        <div>
            <Header />
            <div>
                <h1>{event.title}</h1>
                <h2 className="event-by">Event Created by: {event.createdBy}</h2>
            </div>

            <div className="date">
                <h2 className="date">Date & Time: {event.dateTime}</h2>
            </div>

            <div>
                <input 
                    type="checkbox" 
                    id="attendEvent" 
                    checked={isAttending} 
                    onChange={handleAttendanceChange} 
                />
                <label htmlFor="attendEvent">Attend this event</label>
            </div>

            <div className="report-event">
                <Link to={`/report/${eventId}`}>
                    <button>Report Event</button>
                </Link>
            </div>

            <div className="main-containered">
                <ul>
                    <h3>List of Attendees</h3>
                    {event.attendees && event.attendees.length > 0 ? (
                        event.attendees.map((attendee, index) => (
                            <li key={index}>{attendee}</li>
                        ))
                    ) : (
                        <li>No attendees yet</li>
                    )}
                </ul>
            </div>

            <div className="container2">
                {event.images && <img src={event.images} alt={event.title} />}
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
                <h4>Comments</h4>
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
    );
};

export default EventDetails;
