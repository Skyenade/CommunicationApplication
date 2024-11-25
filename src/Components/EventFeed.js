import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Style.css';
import { collection, getDocs, getDoc, addDoc, updateDoc, arrayUnion, arrayRemove, doc, query, where, onSnapshot, orderBy, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../firebase';
import useAuth from '../hooks/useAuth';
import firebase from 'firebase/compat/app';

const EventFeed = () => {
  const [events, setEvents] = useState([]);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [showCommentSection, setShowCommentSection] = useState(null);
  const [loadingComments, setLoadingComments] = useState(false); 
  const { currentUser } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsCollection = collection(firestore, 'events');
        const eventsSnapshot = await getDocs(eventsCollection);
        const eventsList = eventsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...doc.data(),
            likes: data.likes || [],
            dislikes: data.dislikes || [],
            attendees: data.attendees || [],
          };
        });
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
    setLoadingComments(true);
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
      setLoadingComments(false);
    });

    return unsubscribe;
  };

  const handleAddComment = async (eventId) => {
    if (!newComment.trim()) {
      console.log("Comment cannot be empty");
      return;
    }
  
    try {
      if (currentUser) {
        const eventRef = doc(firestore, "events", eventId);
        const eventDoc = await getDoc(eventRef);
        
        if (!eventDoc.exists()) {
          console.error("Event does not exist");
          return;
        }
  
        const eventData = eventDoc.data();
        const eventOwnerId = eventData.ownerId;
        const eventTitle = eventData.title;
  
        await addDoc(collection(firestore, "comments"), {
          eventId,
          userName: currentUser.email,
          text: newComment,
          timestamp: new Date(),
        });
  
        setNewComment("");
  
        if (eventOwnerId !== currentUser.uid) {
          await addDoc(collection(firestore, "notifications"), {
            eventId,
            type: "comment",
            userId: currentUser.uid,
            userEmail: currentUser.email,
            message: `${currentUser.email} commented on the event: ${eventTitle}`,
            timestamp: serverTimestamp(),
            isRead: false,
          });
        }
      } else {
        console.log("User not logged in");
      }
    } catch (error) {
      console.error("Error adding comment: ", error);
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
      const eventDoc = await getDoc(eventRef);
      const eventData = eventDoc.data();
      const eventTitle = eventData.title;
  
      const hasLiked = eventData.likes.includes(currentUser.uid);
      const updateData = hasLiked
        ? { likes: arrayRemove(currentUser.uid) }
        : {
            likes: arrayUnion(currentUser.uid),
            dislikes: arrayRemove(currentUser.uid),
          };
  
      await updateDoc(eventRef, updateData);
  
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId
            ? {
                ...event,
                likes: hasLiked
                  ? event.likes.filter((uid) => uid !== currentUser.uid)
                  : [...event.likes, currentUser.uid],
                dislikes: event.dislikes.filter((uid) => uid !== currentUser.uid), 
              }
            : event
        )
      );
  
      const eventOwnerId = eventData.ownerId;
      if (eventOwnerId !== currentUser.uid && !hasLiked) {
        await addDoc(collection(firestore, "notifications"), {
          eventId: eventId,
          type: "like",
          userId: currentUser.uid,
          userEmail: currentUser.email,
          message: `${currentUser.email} liked ${eventTitle} event `, 
          timestamp: serverTimestamp(),
          isRead: false,
        });
      }
    } catch (error) {
      console.error("Error updating event like:", error);
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

      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === eventId
            ? { ...event, dislikes: [...event.dislikes, currentUser.uid], likes: event.likes.filter(uid => uid !== currentUser.uid) }
            : event
        )
      );

    } catch (error) {
      console.error("Error disliking event:", error);
    }
  };

  const handleReport = async (contentType, contentId) => {
    const reason = prompt("Please provide a reason for reporting this content:");

    if (!reason) return;

    try {
      const reportData = {
        type: contentType,
        contentId: contentId,
        reportReason: reason,
        reportedBy: currentUser.email,
        timestamp: new Date(),
        status: 'pending' 
      };

      await addDoc(collection(firestore, 'reports'), reportData);
      alert('Content reported successfully.');
    } catch (error) {
      console.error('Error reporting content: ', error);
    }
  };

  const handleAttend = async (eventId) => {
    if (!currentUser || !currentUser.email) {
      console.error("User is not authenticated or email is undefined.");
      return;
    }

    try {
      const eventRef = doc(firestore, "events", eventId);
      const eventDoc = await getDoc(eventRef);
      const eventData = eventDoc.data();
      const eventTitle = eventData.title; 

      const isAttending = eventData.attendees.includes(currentUser.email);
      const updateData = isAttending
        ? { attendees: arrayRemove(currentUser.email) }
        : { attendees: arrayUnion(currentUser.email) };

      await updateDoc(eventRef, updateData);

      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === eventId
            ? { ...event, attendees: isAttending ? event.attendees.filter(email => email !== currentUser.email) : [...event.attendees, currentUser.email] }
            : event
        )
      );

      const eventOwnerId = eventData.ownerId;
      if (eventOwnerId !== currentUser.uid) {
        await addDoc(collection(firestore, "notifications"), {
          eventId: eventId,
          type: 'attendance',
          userId: currentUser.uid,
          userEmail: currentUser.email,
          message: `${currentUser.email} is attending ${eventTitle} event`,
          timestamp: serverTimestamp(),
          isRead: false,
        });
      }
    } catch (error) {
      console.error("Error updating event attendance:", error);
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
              <p>Attendees: {event.attendees ? event.attendees.length : 0}</p>
            </div>

            <button className="event-details" onClick={() => handleEventDetailsClick(event.id)}>EventDetails</button>


            {event.images && event.images.length > 0 && (
              <img src={event.images[0]} alt={event.title} className="event-image" />
            )}

            <div>
              <button className="like_btn" onClick={() => handleLike(event.id)}>Like</button>
              <button className="dislike_btn" onClick={() => handleDislike(event.id)}>Dislike</button>
              <button className="attend_btn" onClick={() => handleAttend(event.id)}>Attend</button>
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
                  <button className='post_btn' onClick={() => handleAddComment(event.id)}>Post a Comment</button>
                </div>

                <div className="comments-list">
                  {loadingComments ? (
                    <p>Loading comments...</p>
                  ) : (
                    comments[event.id] && comments[event.id].length > 0 ? (
                      comments[event.id].map((comment) => (
                        <div key={comment.id} className="comment-item">
                          <p><strong>{comment.userName}</strong>: {comment.text}</p>
                          <button
                            className="report_btn"
                            onClick={() => handleReport('comment', comment.id)}
                          >
                            Report Comment
                          </button>
                        </div>
                      ))
                    ) : (
                      <p>No comments yet.</p>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No events available</p>
      )}
    </div>
  );
};

export default EventFeed;