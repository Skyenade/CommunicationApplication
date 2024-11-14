import React, { useState, useEffect } from 'react';
import { firestore } from "../firebase";
import { collection, getDocs } from 'firebase/firestore';
import HeaderAdmin from './HeaderAdmin';

const AdminReports = () => {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        const fetchReports = async () => {
            const querySnapshot = await getDocs(collection(firestore, "reports"));
            const reportsList = querySnapshot.docs.map(doc => doc.data());
            setReports(reportsList);
        };

        fetchReports();
    }, []);

    return (
        <div>
            <HeaderAdmin />
            <div>
                <h1>Reported Events</h1>
                <ul>
                    {reports.map((report, index) => (
                        <li key={index}>
                            <strong>{report.eventId}</strong> reported by <em>{report.userName}</em>
                            <p>Reason: {report.reason}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminReports;