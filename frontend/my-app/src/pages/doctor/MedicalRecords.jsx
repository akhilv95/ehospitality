import { useEffect, useState } from "react";
import { medicalRecordAPI } from "../../services/api";
import toast from "react-hot-toast";

const DoctorMedicalRecords = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
    try {
        const res = await medicalRecordAPI.getAll();

        console.log(JSON.stringify(res.data, null, 2));

        setRecords(res.data.results || res.data || []);
    } catch (error) {
        console.log("Medical Record Error:", error.response?.data);
        console.log(error);

        toast.error("Failed to load medical records");
    } finally {
        setLoading(false);
    }
};

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1>Medical Records</h1>

            {records.map((record) => (
                <div key={record.id}>
                    <h3>
                        {record.patient_detail?.user?.first_name}{" "}
                        {record.patient_detail?.user?.last_name}
                    </h3>

                    <p>Diagnosis : {record.diagnosis}</p>
                    <p>Symptoms : {record.symptoms}</p>
                    <p>Treatment : {record.treatment}</p>
                </div>
            ))}
        </div>
    );
};

export default DoctorMedicalRecords;