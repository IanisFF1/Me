import React, { useState } from 'react';
import { Button, Container, Form, FormGroup, Input, Label, Alert } from 'reactstrap';
import * as API_USERS from './auth-api';
import Register from "./Register";

function Login(props) {
    // Aici tinem minte ce scrie userul
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });

    // Aici tinem minte daca avem eroare
    const [error, setError] = useState(null);

    const [showRegister, setShowRegister] = useState(false);

    // Functia care se apeleaza cand scrii in casute
    const handleChange = (event) => {
        setCredentials({
            ...credentials,
            [event.target.name]: event.target.value
        });
    };

    // Functia care se apeleaza cand apesi butonul
    const handleSubmit = (event) => {
        event.preventDefault(); // Opreste refresh-ul paginii

        console.log("Incercare login cu:", credentials);

        API_USERS.loginUser(credentials, (result, status, err) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Login reusit! Token:", result.token);
                // Aici vom salva token-ul si vom schimba pagina (Pasul 3)
                sessionStorage.setItem("token", result.token);
                sessionStorage.setItem("role", result.role); // <--- Asta e important pentru redirect!
                sessionStorage.setItem("username", result.username); // Optional, pt Home page
                sessionStorage.setItem("userId", result.id)
                props.onLoginSuccess(); // Anuntam parintele (App.js) ca am reusit
            } else {
                setError("Login failed! Check username and password.");
                console.log("Eroare:", err);
            }
        });
    };

    if (showRegister) {
        return (
            <Container className="p-5" style={{ maxWidth: '600px', marginTop: '20px' }}>
                {/* Ii dam Register-ului o functie sa se intoarca inapoi la Login */}
                <Register onGoToLogin={() => setShowRegister(false)} />
            </Container>
        );
    }

    return (
        <Container className="p-5" style={{ maxWidth: '500px', marginTop: '50px', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
            <h2 className="text-center mb-4">Authentication</h2>

            {error && <Alert color="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label for="username">Username</Label>
                    <Input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Enter your username"
                        onChange={handleChange}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="password">Password</Label>
                    <Input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Enter your passowrd"
                        onChange={handleChange}
                        required
                    />
                </FormGroup>
                <Button color="primary" block style={{width: '100%'}}>Login</Button>

                <div className="text-center mt-3">
                    <p>You don't have an account?</p>
                    <Button color="secondary" outline onClick={() => setShowRegister(true)}>
                        Register here
                    </Button>
                </div>
            </Form>
        </Container>
    );
}

export default Login;