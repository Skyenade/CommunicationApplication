import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import Header from "../Components/Header";
import "../Style.css";

const EventDetails = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);

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

        fetchEvent();
    }, [eventId]);
  

    if (!event) {
        return <div>Loading event details...</div>;
        return <div>Loading event details...</div>;
    }
    return (
        <div>
            <Header />
            <div>
                <h1 className="title">{event.title}</h1>
                <h2 className="event-header">Event Created by: {event.createdBy}</h2>


            </div >




            <div className="event-header">
                <h2 className="event-header">Date & Time: {event.dateTime}</h2>

            </div>
            <div className="attendEvent">
                <input type="checkbox" />
                <label htmlFor="attendEvent">Attend this event</label>


                <input type="checkbox" />
                <label htmlFor="reportEvent">Report event</label>
            </div>



            <div className="main-containered">

                <ul>
                    <h3>List of Attendees</h3>
                    <li>John Doe</li>
                    <li>Jane Smith</li>
                    <li>Michael Brown</li>
                    <li>Emily Davis</li>
                </ul>


            <div className="container2">
                {event.images && <img src={event.images} alt={event.title} />}
            </div>

                <div className="container3">
                    <h4>Event Details</h4>
                    <p>{event.details}</p>
                </div>

                <div className="container6">
                    {/* img of the map or location */}
                    {event.images && <img src={event.images} alt="Event Map" />}
                </div>

            <div className="container5">
                <h4>Comments</h4>
            </div>

                <div className="container7">
                    {/* Here you can map and display comments */}
                </div>
            </div >

            <div className="container2">
                {event.images && <img src={event.images} alt={event.title} />}
            </div>

            <div className="container3">
                <h4>Event Details</h4>
            </div>

            <div className="container4">
                <p>{event.details}</p>
            </div>

            <div className="container6">
                {/* {event.images && <img src={event.images} alt="Event Map" />} */}
            </div>

            <div className="container5">
                <h4>Comments</h4>
            </div>

            <div className="container7">
                {/* Here you can map and display comments */}
            </div>

        </div >



    );
};

export default EventDetails;
