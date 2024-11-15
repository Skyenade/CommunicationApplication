import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Style.css';
import { collection, getDocs, addDoc, updateDoc, arrayUnion, arrayRemove, doc, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { firestore } from '../firebase';
import useAuth from '../hooks/useAuth';

const EventFeed = () => {
  const [events, setEvents] = useState([]);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [showCommentSection, setShowCommentSection] = useState(null);


  const { currentUser } = useAuth();


  const [flagReason, setFlagReason] = useState('');
  const [flaggingCommentId, setFlaggingCommentId] = useState(null);


  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsCollection = collection(firestore, 'events');
        const eventsSnapshot = await getDocs(eventsCollection);
        const eventsList = eventsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventsList);
      } catch (error) {
        console.error('Error fetching events: ', error);
      }
    };

    fetchEvents();
  }, []);

  const toggleCommentSection = (eventId) => {
    if (showCommentSection === eventId) {
      setShowCommentSection(null);
    } else {
      setShowCommentSection(eventId);
      fetchComments(eventId);
    }
  };

  const fetchComments = (eventId) => {
    const commentsCollection = collection(firestore, 'comments');
    const commentsQuery = query(
      commentsCollection,
      where('eventId', '==', eventId),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(commentsQuery, (commentsSnapshot) => {
      const commentsList = commentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(prevComments => ({ ...prevComments, [eventId]: commentsList }));
    });

    return unsubscribe;
  };

  const handleAddComment = async (eventId) => {
    if (!newComment.trim()) {
      console.log('Comment cannot be empty');
      return;
    }

    try {
      if (currentUser) {
        await addDoc(collection(firestore, 'comments'), {
          eventId,
          userName: currentUser.email,
          text: newComment,
          timestamp: new Date(),
        });
        setNewComment('');
      } else {
        console.log('User not logged in');
      }
    } catch (error) {
      console.error('Error adding comment: ', error);
    }
  };

  const handleEventDetailsClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const handleLike = async (eventId) => {
    if (!currentUser || !currentUser.uid) {
      console.error("User is not authenticated or userId is undefined.");
      return;
    }

    try {
      const eventRef = doc(firestore, "events", eventId);
      await updateDoc(eventRef, {
        likes: arrayUnion(currentUser.uid),
        dislikes: arrayRemove(currentUser.uid)
      });
      console.log("Event liked successfully.");
    } catch (error) {
      console.error("Error liking event:", error);
    }
  };

  const handleDislike = async (eventId) => {
    if (!currentUser || !currentUser.uid) {
      console.error("User is not authenticated or userId is undefined.");
      return;
    }

    try {
      const eventRef = doc(firestore, "events", eventId);
      await updateDoc(eventRef, {
        dislikes: arrayUnion(currentUser.uid),
        likes: arrayRemove(currentUser.uid)
      });
      console.log("Event disliked successfully.");
    } catch (error) {
      console.error("Error disliking event:", error);
    }
  };


  return (
    <div className="event-feed">
      <h1 className="home-heading">Event Feed</h1>
      {events.length > 0 ? (
        events.map((event) => (
          <div key={event.id} className="event-card">
            <h2>{event.title}</h2>
            <p><strong>Date & Time:</strong> {new Date(event.dateTime).toLocaleString()}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Details:</strong> {event.details}</p>

            <div>
              <p>Likes: {event.likes ? event.likes.length : 0}</p>
              <p>Dislikes: {event.dislikes ? event.dislikes.length : 0}</p>
            </div>

            <button className="like_btn" onClick={() => handleEventDetailsClick(event.id)}>EventDetails</button>

            {event.images && event.images.length > 0 && (
              <img src={event.images[0]} alt={event.title} className="event-image" />
            )}

            <div>
              <button className="like_btn" onClick={() => handleLike(event.id)}>Like</button>
              <button className="dislike_btn" onClick={() => handleDislike(event.id)}>Dislike</button>
              <button
                className="comment_btn"
                onClick={() => toggleCommentSection(event.id)}
              >
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
                        <p className="comment-date">
                          {comment.timestamp ? new Date(comment.timestamp.toDate()).toLocaleString() : 'Date not available'}
                        </p>
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
  );
};

export default EventFeed;
