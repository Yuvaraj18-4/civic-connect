import { useState, useRef } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const ReportIssue = () => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Road');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const navigate = useNavigate();

    const startCamera = async () => {
        setShowCamera(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera");
            setShowCamera(false);
        }
    };

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob((blob) => {
                const file = new File([blob], "captured_image.jpg", { type: "image/jpeg" });
                setImage(file);
                stopCamera();
            }, 'image/jpeg');
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setShowCamera(false);
    };

    const handleLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
            }, () => {
                alert('Unable to retrieve your location');
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        formData.append('description', description);
        formData.append('location', location);
        if (image) formData.append('image', image);

        try {
            await api.post('/issues', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/issues');
        } catch (error) {
            console.error(error);
            alert('Failed to report issue');
        }
    };

    return (
        <div className="card" style={{ maxWidth: '600px', margin: '20px auto' }}>
            <h2>Report an Issue</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="Road">Road</option>
                        <option value="Water">Water</option>
                        <option value="Electricity">Electricity</option>
                        <option value="Garbage">Garbage</option>
                        <option value="Public Safety">Public Safety</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows="4"></textarea>
                </div>
                <div className="form-group">
                    <label>Location</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Address or GPS" />
                        <button type="button" onClick={handleLocation} className="btn btn-secondary">Get GPS</button>
                    </div>
                </div>
                <div className="form-group">
                    <label>Image</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <input type="file" onChange={(e) => setImage(e.target.files[0])} accept="image/*" />
                        <button type="button" onClick={startCamera} className="btn btn-secondary">Take Photo</button>
                    </div>
                    {showCamera && (
                        <div style={{ marginTop: '10px' }}>
                            <video ref={videoRef} autoPlay style={{ width: '100%', maxWidth: '300px', borderRadius: '4px' }}></video>
                            <div style={{ marginTop: '5px' }}>
                                <button type="button" onClick={capturePhoto} className="btn btn-primary" style={{ marginRight: '10px' }}>Capture</button>
                                <button type="button" onClick={stopCamera} className="btn btn-secondary">Cancel</button>
                            </div>
                        </div>
                    )}
                    <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                    {image && !showCamera && (
                        <div style={{ marginTop: '10px' }}>
                            <p>Image selected: {image.name}</p>
                        </div>
                    )}
                </div>
                <button type="submit" className="btn btn-primary">Submit Report</button>
            </form>
        </div>
    );
};

export default ReportIssue;
