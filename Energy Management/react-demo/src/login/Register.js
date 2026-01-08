import React, { useState } from 'react';
import { Button, Container, Form, FormGroup, Input, Label, Alert } from 'reactstrap';
import * as API_AUTH from './auth-api';

function Register(props) {
    const [userData, setUserData] = useState({
        username: '',
        password: '',
        role: 'CLIENT', // Default
        name: '',
        age: '',
        address: '',
        adminKey: ''
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const SECRET_ADMIN_KEY = "9456872638327465";

    const handleChange = (event) => {
        setUserData({
            ...userData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // 1. Facem o copie a datelor (ca sa nu modificam state-ul direct)
        let dataToSend = { ...userData };

        // Convertim varsta in numar (backend-ul asteapta int)
        dataToSend.age = parseInt(userData.age);

        // 2. VERIFICARE DE SECURITATE PENTRU ADMIN
        if (userData.role === 'ADMIN') {
            if (userData.adminKey !== SECRET_ADMIN_KEY) {
                setError("Wrong code! Permission denied.");
                return; // Oprim totul aici. Nu trimitem nimic la server.
            }
        }

        // 3. CURATENIE: Stergem campul adminKey din obiectul pe care il trimitem
        // Backend-ul nu are acest camp in DTO si nu are nevoie de el.
        delete dataToSend.adminKey;

        console.log("Date trimise catre server:", dataToSend);

        // 4. Trimitem cererea
        API_AUTH.registerUser(dataToSend, (result, status, err) => {
            if (result !== null && (status === 200 || status === 201)) {
                setSuccess(true);
                setError(null);
                setTimeout(() => {
                    props.onGoToLogin();
                }, 2000);
            } else {
                setSuccess(false);
                // Afisam eroarea venita din backend (cea cu JSON)
                if (result && result.error) {
                    setError(result.error);
                } else {
                    setError("Registration error! Check your data.");
                }
            }
        });
    };

    return (
        <Container className="p-4" style={{ backgroundColor: '#fff', borderRadius: '10px' }}>
            <h3 className="text-center mb-4">Register to new account</h3>

            {error && <Alert color="danger">{error}</Alert>}
            {success && <Alert color="success">Account created successfully! Redirecting...</Alert>}

            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label>Username</Label>
                    <Input name="username" placeholder="Choose a unique username" onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                    <Label>Password</Label>
                    <Input type="password" name="password" placeholder="Choose a password" onChange={handleChange} required />
                </FormGroup>

                {/* SELECTARE ROL */}
                <FormGroup>
                    <Label>Rol</Label>
                    <Input type="select" name="role" value={userData.role} onChange={handleChange}>
                        <option value="CLIENT">Client</option>
                        <option value="ADMIN">Admin</option>
                    </Input>
                </FormGroup>

                {/* CAMP COD SECRET (Apare doar daca e Admin) */}
                {userData.role === 'ADMIN' && (
                    <FormGroup>
                        <Label className="text-danger">Special Admin Code</Label>
                        <Input
                            type="password"
                            name="adminKey"
                            placeholder="Type in secret key"
                            onChange={handleChange}
                        />
                    </FormGroup>
                )}

                <hr />
                <FormGroup>
                    <Label>Full name</Label>
                    <Input name="name" placeholder="Ex: Popescu Ion" onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                    <Label>Age</Label>
                    <Input type="number" name="age" placeholder="Ex: 25" onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                    <Label>Address</Label>
                    <Input name="address" placeholder="Ex: Str. Principala nr 1" onChange={handleChange} required />
                </FormGroup>

                <Button color="success" block style={{width: '100%'}}>Create account</Button>

                <div className="text-center mt-3">
                    <Button color="link" onClick={props.onGoToLogin}>You already have an account? Login</Button>
                </div>
            </Form>
        </Container>
    );
}

export default Register;