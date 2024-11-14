const EventDetails = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [reportReason, setReportReason] = useState("");
    const [isAttending, setIsAttending] = useState(false); 
  

    useEffect(() => {
        if (!eventId) {
            console.error("No event ID provided.");
            return;
        }

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

        return () => unsubscribe(); 
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
            </div>
        </div>
    );
};