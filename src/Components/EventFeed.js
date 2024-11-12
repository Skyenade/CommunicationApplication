import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Style.css';


import { collection, addDoc,getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { firestore } from '../firebase'; 
import { getAuth } from 'firebase/auth'; 


const EventFeed = () => {
  const [events, setEvents] = useState([]);
  const [comments, setComments] = useState({}); 
  const [newComment, setNewComment] = useState('');
  const [showCommentSection, setShowCommentSection] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsCollection = collection(firestore, 'events');
        const eventsSnapshot = await getDocs(eventsCollection);
        const eventsList = eventsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEvents(eventsList);
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    };

    fetchEvents();
  }, []);

  const fetch_Comments = (eventId) => {
    const commentsCollection = collection(firestore, 'comments');
    const commentsQuery = query(commentsCollection, where('eventId', '==', eventId));

    const unsubscribe = onSnapshot(commentsQuery, (commentsSnapshot) => {
      const commentsList = commentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments((prevComments) => ({ ...prevComments, [eventId]: commentsList }));
    });


    return unsubscribe; 
  };

  const handleAddComment = async (eventId) => {
    if (!newComment.trim()) {
      console.log('Comment cannot be empty');
      return; 
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser; 
       
      if (user) {
        const userEmail = user.email; 
        await addDoc(collection(firestore, 'comments'), {
          eventId,
          userName: userEmail, 
          text: newComment,
          timestamp: new Date(),
        });

        setNewComment(''); 
      } else {
        console.log('error ');
      }
    } catch (error) {
      console.error('Error adding comment: ', error);
    }
  };

  const toggleCommentSection = (eventId) => {
    if (showCommentSection === eventId) {
      setShowCommentSection(null); 
    } else {
      setShowCommentSection(eventId); 
      fetch_Comments(eventId); 
    }
  };

  

  const handleEventDetailsClick = (eventId) => {
    navigate(`/event/${eventId}`); // Navegar a la ruta con el ID del evento
  };

  return (
    <div>
      <div className="event-feed">
        <h1 className='home-heading'>Event Feed</h1>
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="event-card">
              <h2>{event.title}</h2>
              <p><strong>Date & Time:</strong> {new Date(event.dateTime).toLocaleString()}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Details:</strong> {event.details}</p>
              <button          
                 className="like_btn" onClick={() => handleEventDetailsClick('5X8fXmD6gpmMNmQdCiU6')}>EventDetails</button>
               

           

              {event.images && event.images.length > 0 && (
                <img src={event.images[0]} alt={event.title} className="event-image" />

              )}
              {/* If coordinates are available, you can display them */}
              {/* {event.coordinates && (
                <div className="event-coordinates">
                  <p><strong>Coordinates:</strong> {event.coordinates.lat}, {event.coordinates.lng}</p>
                </div>
              )} */}
              
              <div>

<button className='like_btn'>Like</button>
  <button className='comment_btn' onClick={() => toggleCommentSection(event.id)}>
    {showCommentSection === event.id ? 'Hide Comments' : 'Comments'}
  </button>
</div>


{showCommentSection === event.id && (
  <div className="comments-section">
    <div className="add-comment">
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment..."
      />
      <button className='post_btn' onClick={() => handleAddComment(event.id)}>Post Comment</button>
    </div>

    <div className="comments-list">
      {comments[event.id] && comments[event.id].length > 0 ? (
        comments[event.id].map((comment) => (
          <div key={comment.id} className="comment">
            <p><strong>{comment.userName}:</strong> {comment.text}</p>
          </div>
        ))
      ) : (
        <p>No comments yet.</p>
      )}
    </div>
  </div>
)}


            </div>
          ))
        ) : (
          <p>No events to show.</p>
        )}
      </div>
    </div>
  );
};

export default EventFeed;
