import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';  // For getting the event ID from the URL
import { ref, onValue, push, set } from 'firebase/database';
import { database } from '../firebase';
import { getAuth } from 'firebase/auth';

const Comments =() => {
    return(
       <div>
        
       </div>
    );
};

export default Comments;