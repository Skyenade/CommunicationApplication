import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { doc, getDoc, updateDoc, arrayUnion, setDoc, collection, query, where, getDocs } from "firebase/firestore"; 

import { firestore, auth } from "../firebase";
import Header from "../Components/Header";
import "../Style.css";

// Your component function starts here
const EventDetails = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [isAttending, setIsAttending] = useState(false);
    const [reportReason, setReportReason] = useState("");

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

                const userDocRef = doc(firestore, "users", auth.currentUser.uid);
                const userSnapshot = await getDoc(userDocRef);
                if (userSnapshot.exists()) {
                    const userData = userSnapshot.data();
                    setIsAttending(userData.attendingEvents?.includes(eventId));
                }
            } catch (error) {
                console.error("Error fetching event:", error);
            }
        };

        fetchEvent();
    }, [eventId]);

    const handleAttendanceChange = async (e) => {
        const newAttendanceStatus = e.target.checked;
        setIsAttending(newAttendanceStatus);

        try {
            const userDocRef = doc(firestore, "users", auth.currentUser.uid);
            const eventDocRef = doc(firestore, "events", eventId);

            if (newAttendanceStatus) {
                await updateDoc(userDocRef, {
                    attendingEvents: arrayUnion(eventId)
                });
                await updateDoc(eventDocRef, {
                    attendees: arrayUnion(auth.currentUser.displayName)
                });
                window.alert("You are now attending this event!");
            }
            console.log("Attendance status updated successfully!");
        } catch (error) {
            console.error("Error updating attendance:", error);
        }
    };

    const handleReportEvent = async () => {
        if (reportReason.trim() === "") {
            window.alert("Please provide a reason for reporting the event.");
            return;
        }
        try {
            const user = auth.currentUser;

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
                const userQuery = query(collection(firestore, "users"), where("role", "in", ["admin", "moderator"]));
                const userSnapshot = await getDocs(userQuery);

                userSnapshot.forEach(async (userDoc) => {
                    const userData = userDoc.data();
                    await setDoc(doc(notificationRef, `${userDoc.id}_${eventId}`), {
                        ...reportData,
                        targetUserId: userDoc.id, 
                    });
                });

                window.alert("Event reported successfully!");
                setReportReason("");  

            }
        } catch (error) {
            console.error("Error reporting event:", error);
            window.alert("Failed to report the event.");
        }
    

    if (!event) {
        return <div>Loading event details...</div>;
    }

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

            {/* Report Section */}
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
                    {event.attendees ? (
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

            <div className="container3">
                <h4>Event Details</h4>
            </div>

            <div className="container4">
                <p>{event.details}</p>
            </div>
        </div>
    );
};

export default EventDetails;
