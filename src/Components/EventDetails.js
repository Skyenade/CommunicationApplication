import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion, setDoc, collection, query, where,onSnapshot, getDocs, arrayRemove, orderBy } from "firebase/firestore"; 
import { firestore, auth } from "../firebase";
import Header from "../Components/Header";
import '../Style.css';


const EventDetails = () => {
    const { eventId } = useParams();
    const [user,setUser] = useState("");
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
            const user = auth.currentUser;

            const reportData = {
                eventId,
                userId: auth.currentUser.uid,
                userName: auth.currentUser.displayName,
                email: auth.currentUser.email,
                reason: reportReason,
                timestamp: new Date(),
                status: "flagged"
            };
            

            if (user) {
                const notificationRef = collection(firestore, 'notifications');
                const reportData = {
                    type: 'event_report',
                    eventId,
                    userId: user.uid,
                    userName: user.displayName,
                    userEmail: user.email,
                    reason: reportReason,
                    timestamp: new Date(),
                    isRead: false,
                };
                await setDoc(doc(notificationRef, `${eventId}_${user.uid}`), reportData);
                console.log("Event reported successfully");
            await setDoc(doc(firestore, "reports", `${eventId}_${auth.currentUser.uid}`), reportData);
            
           
            // const notificationRef = collection(firestore, "notifications");
            // await addDoc(notificationRef, {
            //     message: "A new event report requires verification.",
            //     eventId: eventId,
            //     reportedBy: auth.currentUser.displayName,
            //     timestamp: new Date(),
            //     status: "unread"
            // });

                const userQuery = query(collection(firestore, "users"), where("role", "in", ["admin", "moderator"]));
                const userSnapshot = await getDocs(userQuery);
                userSnapshot.forEach(async (userDoc) => {
                    await setDoc(doc(notificationRef, `${userDoc.id}_${eventId}`), {
                        ...reportData,
                        targetUserId: userDoc.id,
                    });
                });

                window.alert("Event reported successfully!");
                setReportReason("");
            }
            await setDoc(doc(firestore, "reports", `${eventId}_${auth.currentUser.uid}`), reportData);

            window.alert("Event reported successfully!");
            setReportReason("");
        } catch (error) {
            console.error("Error reporting event:", error);
            window.alert("Failed to report the event.");
        }
    };
    
    const handleFlagComment = async (commentId, reason) => {
        try {
            const user = auth.currentUser;

            if (user) {
                const notificationData = {
                    type: 'comment_flag',
                    commentId,
                    eventId,
                    reason,
                    userId: user.uid,
                    userEmail: user.email,
                    timestamp: new Date().toISOString(),
                    isRead: false,
                };

                const notificationRef = collection(firestore, 'notifications');
                await setDoc(doc(notificationRef, `${user.uid}_${commentId}`), notificationData);

                const moderatorQuery = query(collection(firestore, 'users'), where('role', '==', 'moderator'));
                const moderatorSnapshot = await getDocs(moderatorQuery);

                moderatorSnapshot.forEach(async (moderator) => {
                    const moderatorId = moderator.id;
                    await setDoc(doc(notificationRef, `${moderatorId}_${commentId}`), notificationData);
                });

                window.alert("Comment flagged successfully!");
            }
        } catch (error) {
            console.error("Error flagging comment:", error);
            window.alert("Failed to flag the comment.");
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
                    checked={event.attendees?.includes(auth.currentUser.displayName)}
                    onChange={handleAttendanceChange} 
                />
                <label htmlFor="attendEvent">Attend this event</label>
            </div>
               

            <div>
                <textarea
                    id="reportReason"
                    placeholder="Provide reason for reporting"
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                />
                <button onClick={handleReportEvent}>Report Event</button>
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

{/* <<<<<<< HEAD
            <div className="container3">
                <h4>Event Details</h4>
            </div>

            <div className="container4">
                <p>{event.details}</p>
======= */}
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
