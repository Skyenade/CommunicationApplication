import { collection, doc, setDoc, addDoc, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../firebase';
import { getAuth } from 'firebase/auth';

export const handleFlagComment = async (commentId, eventId, setFlaggingCommentId) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
  
      if (user) {
        const notificationRef = collection(firestore, 'notifications');
  
        const notificationData = {
          type: 'comment_flag',
          commentId,
          eventId,
          userId: user.uid,
          userEmail: user.email,
          timestamp: new Date().toISOString(),
          isRead: false,
        };
  
        await setDoc(doc(notificationRef, `${user.uid}_${commentId}`), notificationData);
  
        const moderatorQuery = query(collection(firestore, 'users'), where('role', '==', 'moderator'));
        const moderatorSnapshot = await getDocs(moderatorQuery);
  
        moderatorSnapshot.forEach(async (moderator) => {
          const moderatorId = moderator.id;
          await setDoc(doc(notificationRef, `${moderatorId}_${commentId}`), notificationData);
        });
  
        console.log('Comment flagged successfully');
        setFlaggingCommentId(null);
      }
    } catch (error) {
      console.error('Error flagging comment: ', error);
    }
  };
  
  export const handleReportEvent = async (eventId, reportReason, user) => {
    try {
        const notificationRef = collection(firestore, 'notifications');

        const reportData = {
            type: 'event_report',
            eventId,
            userId: user.uid,
            userEmail: user.email,
            reason: reportReason,
            timestamp: new Date().toISOString(),
            isRead: false,
        };

        await setDoc(doc(notificationRef, `${eventId}_${user.uid}`), reportData);
        console.log('Event reported successfully');

        const moderatorQuery = query(collection(firestore, 'users'), where('role', '==', 'moderator'));
        const moderatorSnapshot = await getDocs(moderatorQuery);

        moderatorSnapshot.forEach(async (moderator) => {
            await setDoc(doc(notificationRef, `${moderator.id}_${eventId}`), {
                ...reportData,
                targetModeratorId: moderator.id,
            });
        });
    } catch (error) {
        console.error('Error reporting event:', error);
        throw new Error('Failed to report the event.');
    }
};
  