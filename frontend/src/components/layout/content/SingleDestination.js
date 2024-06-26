import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { simpleUrl } from '../small_components/Url';
import Styles from "../../../styles/SingleDestination.module.css";
import { mySwal } from '../small_components/Alert';
import { Rating } from 'react-simple-star-rating';

function SingleDestination() {
    const { id } = useParams();
    const [dest, setDest] = useState({ name: "", country: "", city: "", description: "" });
    const [editMode, setEditMode] = useState(false);
    const [feedbackMode, setFeedbackMode] = useState(false);
    const [feedback, setFeedback] = useState({ comment: "", rating: 0 });
    const [reviews, setReviews] = useState([]);
    const navigate = useNavigate();

    const handleRatingChange=(rate)=>{
        
        setFeedback({
            ...feedback,
            rating:rate
        });
    }

    
    const handleClick = () => {
        const token = localStorage.getItem('x-auth-token');
        if (!token) {
            mySwal.fire({
                title: 'Error',
                text: 'You need to be logged in to create a booking',
                icon: 'error',
                showConfirmButton: true,
                timer: 2000
            });
            return;
        } else {
            navigate(`/booking/${id}`);
        }
    }

    useEffect(() => {
        window.scrollTo({top:0, behavior:'smooth'});
        axios.get(`${simpleUrl}/destination/${id}`)
            .then((response) => {
                setDest(response.data.data);
            }).catch((error) => {
                console.log(error);
            });
    }, [id]);

        // Get reviews
                useEffect(()=>{
                    axios.get(`${simpleUrl}/review`)
                    .then((response) => {
                        const data = response.data.data.filter((review) => review.entityId === id);
                         setReviews(data);
                        console.log(data);
                    }).catch((error) => {
                        console.log(error);
            }).catch((error) => {
                console.log(error);
                mySwal.fire({
                    title: 'Error',
                    text: 'Failed to submit feedback',
                    icon: 'error',
                    showConfirmButton: true,
                    timer: 2000
                });
            });
                },[])




    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDest({
            ...dest,
            [name]: value
        });
    };

    const handleUpdateClick = () => {
        setEditMode(true);
    };

    const { name, country, city, description } = dest;
    const handleSaveClick = () => {
        axios.put(`${simpleUrl}/destination/${id}`, {
            name,
            country,
            city,
            description
        
        },{
            headers:{
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('x-auth-token')
            }
        })
            .then((response) => {
                mySwal.fire({
                    title: 'Success',
                    text: 'Destination updated successfully',
                    icon: 'success',
                    showConfirmButton: true,
                    timer: 2000
                });
                setEditMode(false);
            }).catch((error) => {
                console.log(error);
                mySwal.fire({
                    title: 'Error',
                    text: 'Failed to update destination',
                    icon: 'error',
                    showConfirmButton: true,
                    timer: 2000
                });
            });
    };

    const handleFeedbackClick = () => {
        setFeedbackMode(true);
    };

    const handleFeedbackChange = (e) => {
        const { name, value } = e.target;
        setFeedback({
            ...feedback,
            [name]: value
        });
    };


    const handleFeedbackSubmit = () => {
        axios.post(`${simpleUrl}/review`,{
            comment: feedback.comment,
            rating: feedback.rating,
            entityId: id,
            entityType: 'destination'
        },{
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('x-auth-token')
            },
        })
            .then((response) => {
                mySwal.fire({
                    title: 'Success',
                    text: 'Feedback submitted successfully',
                    icon: 'success',
                    showConfirmButton: true,
                    timer: 2000
                });
                setFeedbackMode(false);
            }).catch((error) => {
                console.log(error);
                mySwal.fire({
                    title: 'Error',
                    text: 'Failed to submit feedback',
                    icon: 'error',
                    showConfirmButton: true,
                    timer: 2000
                });
            });
    };

    return (
        <div className={Styles.card}>
            <img src="https://via.placeholder.com/150" alt="destination" />
            {editMode ? (
                <div>
                    <input
                        type="text"
                        name="name"
                        value={dest.name}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        name="country"
                        value={dest.country}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        name="city"
                        value={dest.city}
                        onChange={handleInputChange}
                    />
                    <textarea
                        name="description"
                        value={dest.description}
                        onChange={handleInputChange}
                    />
                    <button onClick={handleSaveClick} className={Styles.button1}>Save</button>
                </div>
            ) : (
                <div>
                    <h1>{dest.name}</h1>
                    <p><strong>Country:</strong> {dest.country}</p>
                    <p><strong>City:</strong> {dest.city}</p>
                    <p>{dest.description}</p>
                </div>
            )}
            <button onClick={handleClick} className={Styles.button1}>Book this Place</button>
            <Link to="/" ><button className={Styles.button2}>Destinations</button></Link>
            <button onClick={handleUpdateClick} className={Styles.button3}>Update Destination</button>
            <button onClick={handleFeedbackClick} className={Styles.button4}>Feedback</button>
            {feedbackMode && (
                <div className={Styles.feedback}>
                    <textarea
                        name="comment"
                        value={feedback.comment}
                        onChange={handleFeedbackChange}
                        placeholder="Leave your feedback"
                    />
                    <Rating
                            onClick={handleRatingChange}
                        />
                    <button onClick={handleFeedbackSubmit} className={Styles.button1}>Submit Feedback</button>
                </div>
            )}
             <div className={Styles.reviews}>
                <h2>Reviews</h2>
                <div className={Styles.reviewsGrid}>
                    {reviews.map((review, index) => (
                        <div key={index} className={Styles.reviewCard}>
                            <p>{review.comment}</p>
                            <div className={Styles.stars}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                    <span key={star} className={review.rating >= star ? Styles.filledStar : Styles.emptyStar}>
                                        ⭐
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SingleDestination;
