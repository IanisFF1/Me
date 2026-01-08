import React, { useState, useEffect } from 'react';
import {
    Table, Button, Container, Modal, ModalHeader, ModalBody, ModalFooter,
    Form, FormGroup, Label, Input, Alert, Badge
} from 'reactstrap';
import * as API_USERS from './api/person-api';

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);

    // Stare pentru Modal (Add/Edit)
    const [modal, setModal] = useState(false);
    const [currentPerson, setCurrentPerson] = useState({ id: '', name: '', age: '', address: '', role: 'CLIENT' });
    const [isEditMode, setIsEditMode] = useState(false);

    // --- STARE NOUA PENTRU MODALA DE DELETE ---
    const [deleteModal, setDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const currentUserId = sessionStorage.getItem("userId");

    // Functie care incarca userii din Backend
    const fetchUsers = () => {
        API_USERS.getPersons((result, status, err) => {
            if (result !== null && status === 200) {
                setUsers(result);
                setIsLoaded(true);
            } else {
                setError("Error loading users!"); // Tradus
                setIsLoaded(true);
            }
        });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Toggle Modal Edit/Add
    const toggle = () => {
        setModal(!modal);
        setError(null);
    };

    // Toggle Modal Delete
    const toggleDeleteModal = () => {
        setDeleteModal(!deleteModal);
        // Resetam ID-ul cand inchidem modala
        if (deleteModal) {
            setUserToDelete(null);
        }
    };

    // Deschide modalul pentru EDITARE
    const openEditModal = (person) => {
        setCurrentPerson(person);
        setIsEditMode(true);
        toggle();
    };

    // --- LOGICA NOUA DE STERGERE ---

    // 1. Doar deschidem fereastra si tinem minte ID-ul
    const handleDeleteClick = (id) => {
        setUserToDelete(id);
        setDeleteModal(true);
    };

    // 2. Executam stergerea cand userul apasa "Confirm"
    const confirmDelete = () => {
        API_USERS.deletePerson(userToDelete, (result, status, err) => {
            if (status === 200 || status === 204) {
                toggleDeleteModal(); // Inchidem fereastra
                fetchUsers();        // Reincarcam lista
            } else {
                alert("Error deleting user!"); // Tradus
            }
        });
    };

    // Salveaza (Add sau Update)
    const handleSave = () => {
        const personData = {
            name: currentPerson.name,
            age: parseInt(currentPerson.age),
            address: currentPerson.address,
            role: currentPerson.role
        };

        if (isEditMode) {
            // UPDATE
            API_USERS.updatePerson(currentPerson.id, personData, (result, status, err) => {
                if (status === 200) {
                    toggle();
                    fetchUsers();
                } else {
                    alert("Error updating user!"); // Tradus
                }
            });
        } else {
            // CREATE
            API_USERS.postPerson(personData, (result, status, err) => {
                if (status === 200 || status === 201) {
                    toggle();
                    fetchUsers();
                } else {
                    alert("Error creating user!"); // Tradus
                }
            });
        }
    };

    const handleChange = (e) => {
        setCurrentPerson({ ...currentPerson, [e.target.name]: e.target.value });
    };

    return (
        <Container>
            <h2 className="mt-4">User Administration</h2>

            {error && <Alert color="danger">{error}</Alert>}

            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Address</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.age}</td>
                        <td>{user.address}</td>
                        <td>
                            <Badge color={user.role === 'ADMIN' ? 'danger' : 'success'}>
                                {user.role}
                            </Badge>
                        </td>
                        <td>
                            {/* LOGICA NOUA PENTRU BUTOANE */}
                            {user.role === 'CLIENT' ? (
                                // CAZ 1: E client -> Full control
                                <>
                                    <Button color="info" size="sm" className="mr-2" onClick={() => openEditModal(user)}>
                                        Edit
                                    </Button>
                                    {' '}
                                    <Button color="danger" size="sm" onClick={() => handleDeleteClick(user.id)}>
                                        Delete
                                    </Button>
                                </>
                            ) : (
                                // CAZ 2: E Admin
                                user.id === currentUserId ? (
                                    // E CHIAR EL -> Doar Edit, fara Delete
                                    <Button color="info" size="sm" onClick={() => openEditModal(user)}>
                                        Edit Profile
                                    </Button>
                                ) : (
                                    // E ALT ADMIN -> Protejat complet
                                    <span className="text-muted" style={{fontSize: '0.9em'}}>
                        <em>Admin Protected</em>
                    </span>
                                )
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            {/* MODAL PENTRU ADD/EDIT */}
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>{isEditMode ? 'Edit User' : 'Add User'}</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label>Name</Label>
                            <Input name="name" value={currentPerson.name} onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Age</Label>
                            <Input type="number" name="age" value={currentPerson.age} onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Address</Label>
                            <Input name="address" value={currentPerson.address} onChange={handleChange} />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleSave}>Save</Button>
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>

            {/* MODAL NOU PENTRU DELETE CONFIRMATION */}
            <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
                <ModalHeader toggle={toggleDeleteModal}>Delete User</ModalHeader>
                <ModalBody>
                    Are you sure you want to delete this user? This action cannot be undone.
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={confirmDelete}>Delete</Button>
                    <Button color="secondary" onClick={toggleDeleteModal}>Cancel</Button>
                </ModalFooter>
            </Modal>

        </Container>
    );
}

export default AdminUsers;