import React, { useState } from 'react';
import { useSignupUserMutation } from "../services/appApi";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import './Signup.css';
import defaultImg from '../AppImages/no-img.png';

function Signup(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [signupUser, { isLoading, error }] = useSignupUserMutation();
    const navigate = useNavigate();


    const [image, setImage] = useState(null);
    const [upladingImg, setUploadingImg] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    function validateImg(e) {
        const file = e.target.files[0];
        if (file.size >= 1048576) {
            return alert("File size must be less than 1MB!!")
        }
        else {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    }

    async function uploadImage() {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "n9zq8hwv");
        try {
            setUploadingImg(true);
            let res = await fetch("https://api.cloudinary.com/v1_1/dowwqircj/image/upload", {
                method: "post",
                body: data,
            });
            const urlData = await res.json();
            setUploadingImg(false);
            return urlData.url;
        } catch (error) {
            setUploadingImg(false);
            console.log(error);
        }
    }

    async function submitForm(e) {
        e.preventDefault();
        if (!image) return alert("Please upload your profile picture");
        const url = await uploadImage(image);
        console.log(url);
        // signup the user
        signupUser({ name, email, password, picture: url }).then(({ data }) => {
            if (data) {
                console.log(data);
                navigate("/chat");
            }
        });
    }

    return (
        <Container>
            <Row>

                <Col md={7} className="d-flex align-items-center justify-content-center flex-direction-column">
                    <Form onSubmit={submitForm} >

                        <h1 className="text-center">Create account</h1>
                        <div className="signupImgDiv">
                            <img src={imagePreview || defaultImg} className="signupProfileImg" />
                            <label htmlFor="uploadImg" className="signupImgLabel">
                                <i className="fas fa-plus-circle imgIcon"></i>
                            </label>
                            <input type="file" id="uploadImg" hidden accept="image/png, image/jpeg" onChange={validateImg} />
                        </div>
                        {error && <p className="alert alert-danger">{error.data}</p>}
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Your name" autoComplete='off' onChange={(e) => setName(e.target.value)} value={name} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" autoComplete='off' onChange={(e) => setEmail(e.target.value)} value={email} />

                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            {upladingImg || isLoading ? "Signing you up..." : "Signup"}
                        </Button>

                        <div>
                            <p className='text-center'>Already Have an Account ? <Link to="/login">Login</Link></p>
                        </div>

                    </Form>
                </Col>
                <Col md={5} className="signupImg"></Col>
            </Row>
        </Container>
    );
}

export default Signup;