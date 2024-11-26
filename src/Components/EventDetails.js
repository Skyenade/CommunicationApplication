import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, setDoc, collection, query, where, onSnapshot, getDocs, arrayUnion, arrayRemove, orderBy, updateDoc } from "firebase/firestore";
import { firestore, auth } from "../firebase";
import Header from "../Components/Header";
import '../Style.css';

const EventDetails = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [comments, setComments] = useState([]);
    const [reportReason, setReportReason] = useState("");
    const [isAttending, setIsAttending] = useState(false);

    useEffect(() => {
        if (!eventId) {
            console.error("No event ID provided.");
            return;
        }
    
        const eventDocRef = doc(firestore, "events", eventId);
    
        const unsubscribeEvent = onSnapshot(eventDocRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const eventData = docSnapshot.data();
                console.log("Fetched event:", eventData);
                setEvent(eventData);
                setIsAttending(eventData.attendees?.includes(auth.currentUser.email));
            } else {
                console.log("No event found for this ID");
                setEvent(null);
            }
        });
    
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
                console.log("Fetched comments:", commentsList);
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
        if (!event) return;

        const userDocRef = doc(firestore, "users", auth.currentUser.uid);
        const eventDocRef = doc(firestore, "events", eventId);
        const currentEmail = auth.currentUser.email;

        try {
            if (isAttending) {
                await updateDoc(userDocRef, { attendingEvents: arrayRemove(eventId) });
                await updateDoc(eventDocRef, { attendees: arrayRemove(currentEmail) });
                window.alert("You are no longer attending this event.");
            } else {
                await updateDoc(userDocRef, { attendingEvents: arrayUnion(eventId) });
                await updateDoc(eventDocRef, { attendees: arrayUnion(currentEmail) });
                window.alert("You are now attending this event!");
            }
            setIsAttending((prev) => !prev);
        } catch (error) {
            console.error("Error updating attendance:", error);
            setIsAttending((prev) => !prev);
        }
    };

    const handleReportEvent = async () => {
        if (!auth.currentUser) return window.alert("You must be logged in to report an event.");
        if (reportReason.trim() === "") return window.alert("Please provide a reason for reporting the event.");

        try {
            const user = auth.currentUser;

            const userRef = doc(firestore, "users", user.uid);
            const userSnapshotEmail = await getDocs(query(collection(firestore, "users"), where("email", "==", user.email)));

            let userData = {};
            if (!userSnapshotEmail.empty) {
                userSnapshotEmail.forEach((doc) => {
                    userData = { ...doc };
                });
            }

            const reportData = {
                eventId,
                userId: auth.currentUser.uid,
                username: auth.currentUser.displayName,
                email: auth.currentUser.email,
                reason: reportReason,
                timestamp: new Date(),
                status: "flagged"
            };


            await setDoc(doc(firestore, "reports", `${eventId}_${auth.currentUser.uid}`), reportData);

            const notificationRef = collection(firestore, "notifications");
            const userQuery = query(collection(firestore, "users"), where("role", "in", ["admin", "moderator"]));
            const userSnapshot = await getDocs(userQuery);
            userSnapshot.forEach(async (userDoc) => {
                await setDoc(doc(notificationRef, `${userDoc.id}_${eventId}`), {
                    type: 'event_report',
                    eventId,
                    userId: auth.currentUser.uid,
                    userName: auth.currentUser.displayName,
                    userEmail: auth.currentUser.email,
                    reason: reportReason,
                    timestamp: new Date(),
                    isRead: false,
                    targetUserId: userDoc.id,
                });
                await setDoc(doc(notificationRef, `${eventId}_${user.uid}`), reportData);
                console.log("Event reported successfully");
                await setDoc(doc(firestore, "reports", `${eventId}_${auth.currentUser.uid}`), reportData);


                const userQuery = query(collection(firestore, "users"), where("role", "in", ["admin", "moderator"]));
                const userSnapshot = await getDocs(userQuery);
                userSnapshot.forEach(async (userDoc) => {
                    await setDoc(doc(notificationRef, `${userDoc.id}_${eventId}`), {
                        ...reportData,
                        targetUserId: userDoc.id,
                    });
                });
            });

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

            <h1 className="event-title">{event.title}</h1>
            <div className="event-details-container-1">
                <div className="event-title-container">
                    <h2>Event Created by: {event.createdBy}</h2>
                </div>
                <div className="date">
                    <h2>Date & Time: {event.dateTime}</h2>
                </div>
            </div>

            

            <div className="attendees-image-container">
                <div className="image-container">
                    {event.images && <img src={event.images} alt={event.title} />}
                </div>
                <div className="attendees-container">
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
            </div>

            <div className="event-details-container-2">
                <div className="attend-report-container">
                    <div className="attend-event-container">
                        <input
                            type="checkbox"
                            id="attendEvent"
                            checked={isAttending}
                            onChange={handleAttendanceChange}
                        />
                        <label htmlFor="attendEvent">Attend this event</label>
                    </div>

                    <div className="report-event-container">
                        <textarea
                            className="report-textarea"
                            id="reportReason"
                            placeholder="Provide reason for reporting"
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                        />
                        <button className="report-button" onClick={handleReportEvent}>Report Event</button>
                    </div>
                </div>
            </div>

            <div className="comment-details-container">
                <div className="event-details-text">
                    <h4>Event Details</h4>
                    <p>{event.details}</p>
                </div>

                <div className="comments-section">
                    <h4>Comments</h4>
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <div key={comment.id} className="comment">
                                <p><strong>{comment.username}</strong> ({new Date(comment.timestamp.seconds * 1000).toLocaleString()}):</p>
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