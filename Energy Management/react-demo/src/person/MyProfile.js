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

    const username = sessionStorage.getItem("username");
    const currentUserId = sessionStorage.getItem("userId");
    const [isLoaded, setIsLoaded] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const pageStyle = {
        minHeight: '100vh',
        backgroundColor: '#f4f7f6',
        paddingTop: '50px',
        paddingBottom: '50px'
    };

    // 1. Incarcam datele
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

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSave = (e) => {
        e.preventDefault();

        const dataToSend = {
            name: userData.name,
            age: parseInt(userData.age),
            address: userData.address,
            role: userData.role
        };

        API_USERS.updatePerson(userData.id, dataToSend, (result, status, err) => {
            if (status === 200) {
                setMessage({ type: 'success', text: 'Data updated successfully!' });
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            } else {
                setMessage({ type: 'danger', text: 'Update error!' });
            }
        });
    };

    return (
        <div style={pageStyle}>
            <Container>
                <Row className="justify-content-center">
                    <Col md="8" lg="6">
                        <Card className="shadow border-0" style={{borderRadius: '15px'}}>
                            <CardBody className="p-5">
                                <div className="text-center mb-4">
                                    <h3 style={{fontWeight: 'bold', color: '#333'}}>My Profile</h3>
                                    <p className="text-muted">Manage your personal information</p>
                                </div>

                                {message.text && <Alert color={message.type}>{message.text}</Alert>}

                                {isLoaded ? (
                                    <Form onSubmit={handleSave}>
                                        <FormGroup>
                                            <Label className="text-muted fw-bold" style={{fontSize: '0.9rem'}}>USERNAME</Label>
                                            <Input
                                                type="text"
                                                value={username || ''}
                                                disabled
                                                style={{backgroundColor: '#f8f9fa', border: 'none', fontWeight: 'bold'}}
                                            />
                                        </FormGroup>

                                        <hr className="my-4" />

                                        <FormGroup>
                                            <Label className="fw-bold">Full Name</Label>
                                            <Input name="name" value={userData.name} onChange={handleChange} required />
                                        </FormGroup>

                                        <Row>
                                            <Col md={4}>
                                                <FormGroup>
                                                    <Label className="fw-bold">Age</Label>
                                                    <Input type="number" name="age" value={userData.age} onChange={handleChange} required />
                                                </FormGroup>
                                            </Col>
                                            <Col md={8}>
                                                <FormGroup>
                                                    <Label className="fw-bold">Role</Label>
                                                    <Input type="text" value={userData.role} disabled style={{backgroundColor: '#e9ecef'}} />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <FormGroup>
                                            <Label className="fw-bold">Address</Label>
                                            <Input type="textarea" name="address" value={userData.address} onChange={handleChange} required style={{minHeight: '100px'}} />
                                        </FormGroup>

                                        <Button color="primary" block className="mt-4 shadow-sm" size="lg" style={{borderRadius: '25px'}}>
                                            Save Changes
                                        </Button>
                                    </Form>
                                ) : (
                                    <p className="text-center">Data is loading...</p>
                                )}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default MyProfile;