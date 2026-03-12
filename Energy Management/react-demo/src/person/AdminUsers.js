import React, { useState, useEffect } from 'react';
import {
    Table, Button, Container, Modal, ModalHeader, ModalBody, ModalFooter,
    Form, FormGroup, Label, Input, Alert, Badge, Card, CardBody, Row, Col
} from 'reactstrap';
import * as API_USERS from './api/person-api';
// --- IMPORT NOU ---
import ChatWindow from "../chat/ChatWindow";

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);

    const [modal, setModal] = useState(false);
    const [currentPerson, setCurrentPerson] = useState({ id: '', name: '', age: '', address: '', role: 'CLIENT' });
    const [isEditMode, setIsEditMode] = useState(false);

    const [deleteModal, setDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // --- STATE PENTRU CHAT ---
    const [activeChatUser, setActiveChatUser] = useState(null); // Obiect cu {id, name}

    const currentUserId = sessionStorage.getItem("userId");

    const pageStyle = {
        minHeight: '100vh',
        backgroundColor: '#f4f7f6',
        paddingTop: '50px',
        paddingBottom: '50px'
    };

    const fetchUsers = () => {
        API_USERS.getPersons((result, status, err) => {
            if (result !== null && status === 200) {
                setUsers(result);
                setIsLoaded(true);
            } else {
                setError("Error loading users!");
                setIsLoaded(true);
            }
        });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggle = () => {
        setModal(!modal);
        setError(null);
    };

    const toggleDeleteModal = () => {
        setDeleteModal(!deleteModal);
        if (deleteModal) {
            setUserToDelete(null);
        }
    };

    const openAddModal = () => {
        setCurrentPerson({ id: '', name: '', age: '', address: '', role: 'CLIENT' });
        setIsEditMode(false);
        toggle();
    };

    const openEditModal = (person) => {
        setCurrentPerson(person);
        setIsEditMode(true);
        toggle();
    };

    const goToMyProfile = () => {
        window.location.href = "./my-profile";
    };

    const handleDeleteClick = (id) => {
        setUserToDelete(id);
        setDeleteModal(true);
    };

    const confirmDelete = () => {
        API_USERS.deletePerson(userToDelete, (result, status, err) => {
            if (status === 200 || status === 204) {
                toggleDeleteModal();
                fetchUsers();
            } else {
                alert("Error deleting user!");
            }
        });
    };

    const handleSave = () => {
        const personData = {
            name: currentPerson.name,
            age: parseInt(currentPerson.age),
            address: currentPerson.address,
            role: currentPerson.role
        };

        if (isEditMode) {
            API_USERS.updatePerson(currentPerson.id, personData, (result, status, err) => {
                if (status === 200) {
                    toggle();
                    fetchUsers();
                } else {
                    alert("Error updating user!");
                }
            });
        } else {
            API_USERS.postPerson(personData, (result, status, err) => {
                if (status === 200 || status === 201) {
                    toggle();
                    fetchUsers();
                } else {
                    alert("Error creating user!");
                }
            });
        }
    };

    const handleChange = (e) => {
        setCurrentPerson({ ...currentPerson, [e.target.name]: e.target.value });
    };

    // --- FUNCTIE DESCHIDERE CHAT ---
    const openChat = (user) => {
        setActiveChatUser(user);
    };

    return (
        <div style={pageStyle}>
            <Container>

                <Card className="shadow border-0" style={{borderRadius: '15px'}}>
                    <CardBody className="p-4">


                        <Row className="mb-4 align-items-center">
                            <Col>
                                <h3 style={{fontWeight: 'bold', color: '#333', margin: 0}}>User Administration</h3>
                                <p className="text-muted mb-0">Manage system users and their roles</p>
                            </Col>
                        </Row>

                        {error && <Alert color="danger">{error}</Alert>}

                        <div className="table-responsive">
                            <Table hover className="align-middle">
                                <thead className="bg-light">
                                <tr>
                                    <th className="border-0">Name</th>
                                    <th className="border-0">Age</th>
                                    <th className="border-0">Address</th>
                                    <th className="border-0 text-center">Role</th>
                                    <th className="border-0 text-right">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td style={{fontWeight: '500'}}>{user.name}</td>
                                        <td>{user.age}</td>
                                        <td>{user.address}</td>
                                        <td className="text-center">
                                            <Badge color={user.role === 'ADMIN' ? 'danger' : 'primary'} pill style={{padding: '8px 12px'}}>
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td className="text-right">
                                            {user.role === 'CLIENT' ? (
                                                <>
                                                    {/* --- BUTON CHAT PENTRU CLIENTI --- */}
                                                    <Button
                                                        color="info"
                                                        size="sm"
                                                        className="mr-2 text-white"
                                                        onClick={() => openChat(user)}
                                                        style={{marginRight: '5px', fontWeight: 'bold'}}
                                                    >
                                                        Chat 💬
                                                    </Button>

                                                    <Button color="light" size="sm" className="mr-2 text-primary" onClick={() => openEditModal(user)} style={{marginRight: '5px', fontWeight: 'bold'}}>
                                                        Edit
                                                    </Button>
                                                    <Button color="light" size="sm" className="text-danger" onClick={() => handleDeleteClick(user.id)} style={{fontWeight: 'bold'}}>
                                                        Delete
                                                    </Button>
                                                </>
                                            ) : (
                                                user.id === currentUserId ? (
                                                    <Button
                                                        color="light"
                                                        size="sm"
                                                        className="text-info"
                                                        onClick={goToMyProfile}
                                                        style={{fontWeight: 'bold'}}
                                                    >
                                                        Edit Profile
                                                    </Button>
                                                ) : (
                                                    <span className="text-muted small">
                                                        <i className="fa fa-lock"></i> Protected
                                                    </span>
                                                )
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </div>
                    </CardBody>
                </Card>

                {/* --- MODALE EXISTENTE --- */}
                <Modal isOpen={modal} toggle={toggle} centered>
                    {/* ... cod existent ... */}
                    <ModalHeader toggle={toggle} className="border-0 pb-0">
                        {isEditMode ? 'Edit User Details' : 'Create New User'}
                    </ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label className="fw-bold">Name</Label>
                                <Input name="name" value={currentPerson.name} onChange={handleChange} placeholder="Full Name" />
                            </FormGroup>
                            <Row>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label className="fw-bold">Age</Label>
                                        <Input type="number" name="age" value={currentPerson.age} onChange={handleChange} />
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label className="fw-bold">Role</Label>
                                        <Input type="select" name="role" value={currentPerson.role} onChange={handleChange}>
                                            <option value="CLIENT">CLIENT</option>
                                            <option value="ADMIN">ADMIN</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <FormGroup>
                                <Label className="fw-bold">Address</Label>
                                <Input type="textarea" name="address" value={currentPerson.address} onChange={handleChange} />
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter className="border-0 pt-0">
                        <Button color="primary" onClick={handleSave} style={{borderRadius: '20px', minWidth: '100px'}}>Save</Button>
                        <Button color="secondary" onClick={toggle} style={{borderRadius: '20px'}}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={deleteModal} toggle={toggleDeleteModal} centered>
                    <ModalHeader toggle={toggleDeleteModal} className="text-danger border-0">Confirm Deletion</ModalHeader>
                    <ModalBody>
                        Are you sure you want to delete this user? All their devices and data will be lost.
                    </ModalBody>
                    <ModalFooter className="border-0">
                        <Button color="danger" onClick={confirmDelete} style={{borderRadius: '20px'}}>Yes, Delete</Button>
                        <Button color="secondary" onClick={toggleDeleteModal} style={{borderRadius: '20px'}}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                {/* --- FEREASTRA DE CHAT --- */}
                {activeChatUser && (
                    <ChatWindow
                        onClose={() => setActiveChatUser(null)}
                        myUserId={currentUserId}
                        otherUserId={activeChatUser.id}
                        otherUserName={activeChatUser.name}
                        role="ADMIN"
                    />
                )}

            </Container>
        </div>
    );
}

export default AdminUsers;