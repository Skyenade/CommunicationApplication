import React, { useState } from 'react';
import '../Style.css';
import { useNavigate } from "react-router-dom";
import { ref, set } from 'firebase/database';

import { auth, database } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Header from './Header';

const EventDetails = () => {
    // Define comments as an array of objects
    const comments = [
        {
            name: 'John Doe',
            date: '2024-11-12',
            comment: 'Great event, really looking forward to it!'
        },
        {
            name: 'Jane Smith',
            date: '2024-11-11',
            comment: 'Can’t wait to support my team!'
        },
        {
            name: 'Michael Brown',
            date: '2024-11-10',
            comment: 'Is there parking available?'
        },
        {
            name: 'Emily Davis',
            date: '2024-11-09',
            comment: 'Will there be food at the event?'
        }
    ];

    return (
        <div>
            <Header />
            <h1>Event Title - Created By:</h1>

            <div className="column-date">
                <div className="date-time-attend">
                    <p><strong>Date and time:</strong> 10/10/2024 - 20h</p>
                    <div className="attend-checkbox">
                        <input type="checkbox" id="attendEvent" />
                        <label htmlFor="attendEvent">Attend this event</label>
                    </div>
                    <div className="attend-checkbox">
                        <input type="checkbox" id="reportEvent" />
                        <label htmlFor="reportEvent">Report event</label>
                    </div>
                </div>
            </div>

            <div className="main-containered">

                <div className="container1">
                    <h3>List of Attendees</h3>
                    <ul>
                        <li>John Doe</li>
                        <li>Jane Smith</li>
                        <li>Michael Brown</li>
                        <li>Emily Davis</li>
                    </ul>
                </div>

                <div className="container2">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0SogYG9ozzf1eXu3uwagmhzjPPCWfbDj8bw&s" alt="Evento Deportivo" className="event-image" />
                </div>

                <div className="container3">
                    <h4>Event Details</h4>
                </div>

                <div className="container4">
                    <p>This sports event is an exciting football match between local teams. Join us to witness thrilling moments and support your favorite players!</p>
                </div>

                <div className="container6">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSt1EZORPl39x4KCI-ZfwWo-CVLBHEmyRK1w&s" alt="Google Map" className="map-image" />
                </div>

                <div className="container5">
                    <h4>Comments</h4>
                </div>


                <div className="container7">
                    {comments.map((comment, index) => (
                        <div key={index} className="comment">
                            <p className="comment-author">
                                <strong>{comment.name}</strong> <span className="comment-date">({comment.date})</span>
                            </p>
                            <p className="comment-text">{comment.comment}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
