import React, { useState, useEffect } from 'react';
import {
    Table, Button, Container, Modal, ModalHeader, ModalBody, ModalFooter,
    Form, FormGroup, Label, Input, Alert, Badge, Row
} from 'reactstrap';
import * as API_DEVICES from './api/device-api';
import * as API_USERS from '../person/api/person-api';

function AdminDevices() {
    const [devices, setDevices] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);

    // --- MODALE ---
    const [modal, setModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [assignModal, setAssignModal] = useState(false);
    const [unassignModal, setUnassignModal] = useState(false);

    const [isEditMode, setIsEditMode] = useState(false);

    // --- STATE CURENT ---
    const [currentDevice, setCurrentDevice] = useState({
        id: '',
        name: '',
        maxConsumption: ''
    });

    const [deviceToDelete, setDeviceToDelete] = useState(null);
    const [deviceToUnassign, setDeviceToUnassign] = useState(null);

    // Pentru Assign
    const [selectedDeviceForAssign, setSelectedDeviceForAssign] = useState(null);
    const [selectedUserForAssign, setSelectedUserForAssign] = useState('');

    // --- FETCH DATA ---
    const fetchData = () => {
        API_DEVICES.getDevices((result, status, err) => {
            if (result !== null && status === 200) {
                setDevices(result);
            } else {
                setError("Error loading devices!");
            }
        });

        API_USERS.getPersons((result, status, err) => {
            if (result !== null && status === 200) {
                setUsers(result);
                const clients = result.filter(u => u.role === 'CLIENT');
                if (clients.length > 0) {
                    setSelectedUserForAssign(clients[0].id);
                }
            }
        });
        setIsLoaded(true);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- HELPER: Gaseste numele userului dupa ID ---
    const getUserNameById = (userId) => {
        const user = users.find(u => u.id === userId);
        return user ? user.name : userId;
    };

    // --- TOGGLES ---
    const toggle = () => { setModal(!modal); setError(null); };
    const toggleDeleteModal = () => setDeleteModal(!deleteModal);
    const toggleAssignModal = () => setAssignModal(!assignModal);
    const toggleUnassignModal = () => setUnassignModal(!unassignModal);

    // --- LOGICA ADD / EDIT ---
    const openAddModal = () => {
        setCurrentDevice({ name: '', maxConsumption: '' });
        setIsEditMode(false);
        toggle();
    };

    const openEditModal = (device) => {
        setCurrentDevice({
            id: device.id,
            name: device.name,
            maxConsumption: device.maxConsumption
        });
        setIsEditMode(true);
        toggle();
    };

    const handleSave = () => {
        const deviceData = {
            name: currentDevice.name,
            maxConsumption: parseInt(currentDevice.maxConsumption)
        };

        if (isEditMode) {
            API_DEVICES.updateDevice(currentDevice.id, deviceData, (result, status, err) => {
                if (status === 200) {
                    toggle();
                    fetchData();
                } else {
                    alert("Error updating device!");
                }
            });
        } else {
            API_DEVICES.postDevice(deviceData, (result, status, err) => {
                if (status === 200 || status === 201) {
                    toggle();
                    fetchData();
                } else {
                    alert("Error creating device!");
                }
            });
        }
    };

    // --- LOGICA DELETE ---
    const handleDeleteClick = (id) => {
        setDeviceToDelete(id);
        setDeleteModal(true);
    };

    const confirmDelete = () => {
        API_DEVICES.deleteDevice(deviceToDelete, (result, status, err) => {
            if (status === 200 || status === 204) {
                toggleDeleteModal();
                fetchData();
            } else {
                alert("Error deleting device!");
            }
        });
    };

    // --- LOGICA ASSIGN ---
    const openAssignModalHandler = (deviceId) => {
        setSelectedDeviceForAssign(deviceId);
        toggleAssignModal();
    };

    const handleAssign = () => {
        if (!selectedUserForAssign) {
            alert("Please select a user!");
            return;
        }
        API_DEVICES.assignUserToDevice(selectedDeviceForAssign, selectedUserForAssign, (result, status) => {
            if (status === 200) {
                toggleAssignModal();
                fetchData();
            } else {
                alert("Error assigning user!");
            }
        });
    };

    // --- LOGICA UNASSIGN ---
    const openUnassignModalHandler = (deviceId) => {
        setDeviceToUnassign(deviceId);
        toggleUnassignModal();
    };

    const confirmUnassign = () => {
        API_DEVICES.unassignUserFromDevice(deviceToUnassign, (result, status) => {
            if (status === 200 || status === 204) {
                toggleUnassignModal();
                fetchData();
            } else {
                alert("Error unassigning device!");
            }
        });
    };

    const handleChange = (e) => {
        setCurrentDevice({ ...currentDevice, [e.target.name]: e.target.value });
    };

    return (
        <Container>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <h2 className="mt-4">Device Management</h2>
                <Button color="outline-secondary" className="mt-4" onClick={openAddModal}>Add Device</Button>
            </div>




            {error && <Alert color="danger">{error}</Alert>}

            <Table striped bordered hover responsive>
                <thead style={{backgroundColor: '#343a40', color: 'white'}}>
                <tr>
                    <th>Name</th>
                    <th>Max Consumption</th>
                    <th style={{width: '35%'}}>Assigned users</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {devices.map(dev => (
                    <tr key={dev.id}>
                        <td>{dev.name}</td>
                        <td>{dev.maxConsumption}</td>

                        <td style={{textAlign: 'center'}}>
                            {dev.userId ? (

                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <div style={{textAlign: 'left'}}>
                                        <Badge color="success" className="mr-2">Assigned</Badge>
                                        <span style={{fontWeight: 'bold', fontSize: '0.9em'}}>
                                            To: {getUserNameById(dev.userId)}
                                        </span>
                                    </div>
                                    <Button color="warning" size="sm" onClick={() => openUnassignModalHandler(dev.id)}>
                                        Unassign
                                    </Button>
                                </div>
                            ) : (
                                // CAZUL 2: NU ARE OWNER -> Badge Gri + Buton Assign
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <div style={{textAlign: 'left'}}>
                                        <Badge color="secondary" className="mr-2">Unassigned</Badge>
                                    </div>
                                    <Button color="success" size="sm" onClick={() => openAssignModalHandler(dev.id)}>
                                        Assign User
                                    </Button>
                                </div>
                            )}
                        </td>

                        <td>
                            <Button color="info" size="sm" className="mr-2" onClick={() => openEditModal(dev)}>Edit</Button>
                            <Button color="danger" size="sm" onClick={() => handleDeleteClick(dev.id)}>Delete</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            {/* MODAL ADD/EDIT */}
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>{isEditMode ? 'Edit Device' : 'Add Device'}</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label>Name</Label>
                            <Input name="name" value={currentDevice.name} onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Max Hourly Consumption</Label>
                            <Input type="number" name="maxConsumption" value={currentDevice.maxConsumption} onChange={handleChange} />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleSave}>Save</Button>
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>

            {/* MODAL DELETE */}
            <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
                <ModalHeader toggle={toggleDeleteModal}>Delete Device</ModalHeader>
                <ModalBody>Are you sure you want to delete this device?</ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={confirmDelete}>Delete</Button>
                    <Button color="secondary" onClick={toggleDeleteModal}>Cancel</Button>
                </ModalFooter>
            </Modal>

            {/* MODAL UNASSIGN */}
            <Modal isOpen={unassignModal} toggle={toggleUnassignModal}>
                <ModalHeader toggle={toggleUnassignModal}>Unassign Device</ModalHeader>
                <ModalBody>
                    Are you sure you want to remove the owner from this device?
                </ModalBody>
                <ModalFooter>
                    <Button color="warning" onClick={confirmUnassign}>Confirm Unassign</Button>
                    <Button color="secondary" onClick={toggleUnassignModal}>Cancel</Button>
                </ModalFooter>
            </Modal>

            {/* MODAL ASSIGN */}
            <Modal isOpen={assignModal} toggle={toggleAssignModal}>
                <ModalHeader toggle={toggleAssignModal}>Select User for Device</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label>Available Users (Clients):</Label>
                            <Input type="select"
                                   onChange={(e) => setSelectedUserForAssign(e.target.value)}
                                   value={selectedUserForAssign}
                            >
                                {users.filter(u => u.role === 'CLIENT').map(u => (
                                    <option key={u.id} value={u.id}>
                                        {u.name} (Age: {u.age})
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={handleAssign}>Select & Assign</Button>
                    <Button color="secondary" onClick={toggleAssignModal}>Cancel</Button>
                </ModalFooter>
            </Modal>

        </Container>
    );
}

export default AdminDevices;