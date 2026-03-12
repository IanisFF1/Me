import React, { useState } from 'react';
import { Button, Container, Form, FormGroup, Input, Label, Alert, Card, CardBody } from 'reactstrap';
import * as API_USERS from './auth-api';
import Register from "./Register";

function Login(props) {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });

    const [error, setError] = useState(null);
    const [showRegister, setShowRegister] = useState(false);

    const pageStyle = {
        minHeight: '100vh',
        backgroundColor: '#f4f7f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
    };

    const handleChange = (event) => {
        setCredentials({
            ...credentials,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        API_USERS.loginUser(credentials, (result, status, err) => {
            if (result !== null && (status === 200 || status === 201)) {
                sessionStorage.setItem("token", result.token);
                sessionStorage.setItem("role", result.role);
                sessionStorage.setItem("username", result.username);
                sessionStorage.setItem("userId", result.id)
                props.onLoginSuccess();

                if (result.role == "ADMIN") {
                    window.location.href = "./admin-users"
                } else {
                    window.location.href = "/"
                }

            } else {
                setError("Login failed! Check username and password.");
            }
        });
    };

    if (showRegister) {
        return (
            <div style={pageStyle}>
                <Register onGoToLogin={() => setShowRegister(false)} />
            </div>
        );
    }

    return (
        <div style={pageStyle}>
            <Card className="shadow border-0" style={{width: '100%', maxWidth: '500px', borderRadius: '15px'}}>
                <CardBody className="p-5">
                    <div className="text-center mb-4">
                        <h2 style={{color: '#333', fontWeight: 'bold'}}>Welcome Back</h2>
                        <p className="text-muted">Please login to your account</p>
                    </div>

                    {error && <Alert color="danger" className="text-center">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="username" className="fw-bold">Username</Label>
                            <Input
                                type="text"
                                name="username"
                                id="username"
                                placeholder="Enter your username"
                                onChange={handleChange}
                                required
                                style={{padding: '10px'}}
                            />
                        </FormGroup>
                        <FormGroup className="mb-4">
                            <Label for="password" className="fw-bold">Password</Label>
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Enter your password"
                                onChange={handleChange}
                                required
                                style={{padding: '10px'}}
                            />
                        </FormGroup>

                        <Button color="primary" block size="lg" style={{borderRadius: '25px', width: '100%'}}>
                            Login
                        </Button>

                        <div className="text-center mt-4">
                            <span className="text-muted">Don't have an account? </span>
                            <Button color="link" onClick={() => setShowRegister(true)} style={{padding: 0, verticalAlign: 'baseline'}}>
                                Register here
                            </Button>
                        </div>
                    </Form>
                </CardBody>
            </Card>
        </div>
    );
}

export default Login;