import React, { useState, useEffect } from 'react';
import { Container, Card, CardBody, Form, FormGroup, Label, Input, Button, Alert, Row, Col } from 'reactstrap';
import * as API_USERS from './api/person-api';

function MyProfile() {
    const [userData, setUserData] = useState({
        id: '',
        name: '',
        age: '',
        address: '',
        role: ''
    });

    // Username-ul il luam din sesiune (nu vine din User Service, ci din Auth)
    const username = sessionStorage.getItem("username");
    const currentUserId = sessionStorage.getItem("userId");

    const [isLoaded, setIsLoaded] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' }); // Pentru succes/eroare

    // 1. Incarcam datele de pe server cand intram pe pagina
    useEffect(() => {
        if (currentUserId) {
            API_USERS.getPersonById({ id: currentUserId }, (result, status, err) => {
                if (result !== null && status === 200) {
                    setUserData({
                        id: result.id,
                        name: result.name,
                        age: result.age,
                        address: result.address,
                        role: result.role
                    });
                    setIsLoaded(true);
                } else {
                    setMessage({ type: 'danger', text: 'Could not load profile data.' });
                }
            });
        }
    }, [currentUserId]);

    // 2. Gestionam schimbarile in input-uri
    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    // 3. Salvam modificarile
    const handleSave = (e) => {
        e.preventDefault();

        const dataToSend = {
            name: userData.name,
            age: parseInt(userData.age),
            address: userData.address,
            role: userData.role // Trimitem rolul inapoi ca sa nu il pierdem, desi backend-ul nu ar trebui sa-l schimbe
        };

        API_USERS.updatePerson(userData.id, dataToSend, (result, status, err) => {
            if (status === 200) {
                setMessage({ type: 'success', text: 'Data updated successfully!' });

                // Ascundem mesajul dupa 3 secunde
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            } else {
                setMessage({ type: 'danger', text: 'Update error!' });
            }
        });
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md="8" lg="6">
                    <Card className="shadow">
                        <CardBody className="p-5">
                            <h3 className="text-center mb-4">My Profile</h3>

                            {message.text && <Alert color={message.type}>{message.text}</Alert>}

                            {isLoaded ? (
                                <Form onSubmit={handleSave}>
                                    {/* USERNAME (READ ONLY) */}
                                    <FormGroup>
                                        <Label className="text-muted">Username (Account)</Label>
                                        <Input type="text" value={username || ''} disabled style={{backgroundColor: '#e9ecef'}} />
                                        <small className="text-muted">Username cannot be changed.</small>
                                    </FormGroup>

                                    <hr />

                                    {/* DATE EDITABILE */}
                                    <FormGroup>
                                        <Label>Full name</Label>
                                        <Input name="name" value={userData.name} onChange={handleChange} required />
                                    </FormGroup>

                                    <Row>
                                        <Col md={4}>
                                            <FormGroup>
                                                <Label>Age</Label>
                                                <Input type="number" name="age" value={userData.age} onChange={handleChange} required />
                                            </FormGroup>
                                        </Col>
                                        <Col md={8}>
                                            <FormGroup>
                                                <Label>Role</Label>
                                                <Input type="text" value={userData.role} disabled />
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <FormGroup>
                                        <Label>Address</Label>
                                        <Input type="textarea" name="address" value={userData.address} onChange={handleChange} required />
                                    </FormGroup>

                                    <Button color="primary" block className="mt-4" size="lg">Save changes</Button>
                                </Form>
                            ) : (
                                <p className="text-center">Data is loading...</p>
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default MyProfile;