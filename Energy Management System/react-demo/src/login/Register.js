import React, { useState } from 'react';
import { Button, Form, FormGroup, Input, Label, Alert, Card, CardBody } from 'reactstrap';
import * as API_AUTH from './auth-api';

function Register(props) {
    const [userData, setUserData] = useState({
        username: '',
        password: '',
        role: 'CLIENT',
        name: '',
        age: '',
        address: '',
        adminKey: ''
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const SECRET_ADMIN_KEY = "30112003";

    const handleChange = (event) => {
        setUserData({
            ...userData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        let dataToSend = { ...userData };
        dataToSend.age = parseInt(userData.age);

        if (userData.role === 'ADMIN') {
            if (userData.adminKey !== SECRET_ADMIN_KEY) {
                setError("Wrong code! Permission denied.");
                return;
            }
        }
        delete dataToSend.adminKey;

        API_AUTH.registerUser(dataToSend, (result, status, err) => {
            if (result !== null && (status === 200 || status === 201)) {
                setSuccess(true);
                setError(null);
                setTimeout(() => {
                    props.onGoToLogin();
                }, 2000);
            } else {
                setSuccess(false);
                if (result && result.error) {
                    setError(result.error);
                } else {
                    setError("Registration error! Check your data.");
                }
            }
        });
    };

    return (
        <Card className="shadow border-0" style={{width: '100%', maxWidth: '600px', borderRadius: '15px'}}>
            <CardBody className="p-5">
                <h3 className="text-center mb-4" style={{fontWeight: 'bold', color: '#333'}}>Create Account</h3>

                {error && <Alert color="danger">{error}</Alert>}
                {success && <Alert color="success">Account created successfully! Redirecting...</Alert>}

                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label className="fw-bold">Username</Label>
                        <Input name="username" placeholder="Choose a unique username" onChange={handleChange} required />
                    </FormGroup>
                    <FormGroup>
                        <Label className="fw-bold">Password</Label>
                        <Input type="password" name="password" placeholder="Choose a password" onChange={handleChange} required />
                    </FormGroup>

                    <FormGroup>
                        <Label className="fw-bold">Role</Label>
                        <Input type="select" name="role" value={userData.role} onChange={handleChange}>
                            <option value="CLIENT">Client</option>
                            <option value="ADMIN">Admin</option>
                        </Input>
                    </FormGroup>

                    {userData.role === 'ADMIN' && (
                        <FormGroup>
                            <Label className="text-danger fw-bold">Special Admin Code</Label>
                            <Input
                                type="password"
                                name="adminKey"
                                placeholder="Type in secret key"
                                onChange={handleChange}
                            />
                        </FormGroup>
                    )}

                    <hr className="my-4"/>

                    <FormGroup>
                        <Label className="fw-bold">Full name</Label>
                        <Input name="name" placeholder="Ex: Popescu Ion" onChange={handleChange} required />
                    </FormGroup>
                    <div style={{display: 'flex', gap: '15px'}}>
                        <FormGroup style={{flex: 1}}>
                            <Label className="fw-bold">Age</Label>
                            <Input type="number" name="age" placeholder="Ex: 25" onChange={handleChange} required />
                        </FormGroup>
                        <FormGroup style={{flex: 2}}>
                            <Label className="fw-bold">Address</Label>
                            <Input name="address" placeholder="Ex: Str. Principala nr 1" onChange={handleChange} required />
                        </FormGroup>
                    </div>

                    <Button color="success" block size="lg" className="mt-4" style={{borderRadius: '25px', width: '100%'}}>
                        Create Account
                    </Button>

                    <div className="text-center mt-3">
                        <Button color="link" onClick={props.onGoToLogin}>
                            Already have an account? Login
                        </Button>
                    </div>
                </Form>
            </CardBody>
        </Card>
    );
}

export default Register;