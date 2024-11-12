import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";  // Import useParams for line 9 useParams
import { doc, getDoc } from "firebase/firestore";  
import { firestore } from "../firebase";  
import Header from "../Components/Header";
import "../Style.css";

const EventDetails = () => {
    const { eventId } = useParams(); // Get the eventId from the URL
    const [event, setEvent] = useState(null); // 

    useEffect(() => {
        if (!eventId) {
            console.error("No event ID provided.");
            return;
        }

        const fetchEvent = async () => {
            try {
                const eventDoc = doc(firestore, "events", eventId); // Access the Firestore document using the eventId
                const docSnapshot = await getDoc(eventDoc);

                if (docSnapshot.exists()) {
                    setEvent(docSnapshot.data()); // Use 'setEvent' to save event details
                } else {
                    console.log("No such event!");
                }
            } catch (error) {
                console.error("Error fetching event:", error);
            }
        };

        fetchEvent();
    }, [eventId]); // Re-run the effect if the eventId changes

    if (!event) {
        return <div>Loading event details...</div>; // Display a message while loading details
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
                <input  type="checkbox" id="attendEvent" />
                <label  htmlFor="attendEvent">Attend this event</label>


                <input  type="checkbox" id="reportEvent" />
                <label  htmlFor="reportEvent">Report event</label>
            </div>
          

            <div className="main-containered">
               
                  
                    <ul>
                    <h3>List of Attendees</h3>
                        <li>John Doe</li>
                        <li>Jane Smith</li>
                        <li>Michael Brown</li>
                        <li>Emily Davis</li>
                    </ul>
                </div>

                <div className="container2">
                    {/* event img */}
                    {event.images && <img src={event.images} alt={event.title} />}
                </div>

                <div className="container3">
                    <h4>Event Details</h4>
                </div>

                <div className="container4">
                    <p>{event.details}</p> 
                </div>

                <div className="container6">
                    {/* img of the map or location */}
                    {/* {event.images && <img src={event.images} alt="Event Map" />} */}
                </div>

                <div className="container5">
                    <h4>Comments</h4>
                </div>

                <div className="container7">
                {/* Here you can map and display comments */}
                </div>
            </div>
    
      
    );
};

export default EventDetails;
