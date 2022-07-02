import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useChangeProfilePictureMutation } from "../services/appApi";
import defaultImg from '../AppImages/no-img.png';
import { useNavigate } from "react-router-dom";
import './changeProfilePicture.css';

const ChangeProfilePicture = () => {
    const [email, setEmail] = useState("");
    const [image, setImage] = useState(null);
    const [upladingImg, setUploadingImg] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const [changePic, { isLoading, error }] = useChangeProfilePictureMutation();
    const navigate = useNavigate();

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
        changePic({ email, picture: url }).then(({ data }) => {
            if (data) {
                // console.log(data);
                navigate("/chat");
            }
        });
    }

    return (
        <Container>
            <Row>
                <Col className="d-flex align-items-center justify-content-center flex-direction-column">
                    <Form onSubmit={submitForm}>
                        <h1 className="text-center">Change Picture</h1>
                        <div className="changeImgDiv">
                            <img src={imagePreview || defaultImg} className="changeProfileImg" />
                            <label htmlFor="uploadImg" >
                                <i className="fas fa-plus-circle imgIcon"></i>
                            </label>
                            <input type="file" id="uploadImg" hidden accept="image/png, image/jpeg" onChange={validateImg} />
                        </div>
                        {error && <p className="alert alert-danger">{error.data}</p>}
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" autoComplete='off' onChange={(e) => setEmail(e.target.value)} value={email} />

                        </Form.Group>
                        <div className="text-center">
                            <Button variant="primary" type="submit">
                                {upladingImg || isLoading ? "Uploading..." : "Upload"}
                            </Button>
                        </div>

                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default ChangeProfilePicture;