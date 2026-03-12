import React, { useState, useEffect } from 'react';
import {
    Table, Button, Container, Modal, ModalHeader, ModalBody, ModalFooter,
    Form, FormGroup, Label, Input, Alert, Badge, Row, Col, Card, CardBody
} from 'reactstrap';
import * as API_DEVICES from './api/device-api';
import * as API_USERS from '../person/api/person-api';

function AdminDevices() {
    const [devices, setDevices] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);

    const [modal, setModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [assignModal, setAssignModal] = useState(false);
    const [unassignModal, setUnassignModal] = useState(false);

    const [isEditMode, setIsEditMode] = useState(false);

    const [currentDevice, setCurrentDevice] = useState({
        id: '',
        name: '',
        maxConsumption: ''
    });

    const [deviceToDelete, setDeviceToDelete] = useState(null);
    const [deviceToUnassign, setDeviceToUnassign] = useState(null);

    const [selectedDeviceForAssign, setSelectedDeviceForAssign] = useState(null);
    const [selectedUserForAssign, setSelectedUserForAssign] = useState('');

    const pageStyle = {
        minHeight: '100vh',
        backgroundColor: '#f4f7f6',
        paddingTop: '50px',
        paddingBottom: '50px'
    };

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

    const getUserNameById = (userId) => {
        const user = users.find(u => u.id === userId);
        return user ? user.name : userId;
    };

    const toggle = () => { setModal(!modal); setError(null); };
    const toggleDeleteModal = () => setDeleteModal(!deleteModal);
    const toggleAssignModal = () => setAssignModal(!assignModal);
    const toggleUnassignModal = () => setUnassignModal(!unassignModal);

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
        <div style={pageStyle}>
            <Container>

                <Card className="shadow border-0" style={{borderRadius: '15px'}}>
                    <CardBody className="p-4">

                        <Row className="mb-4 align-items-center">
                            <Col>
                                <h3 style={{fontWeight: 'bold', color: '#333', margin: 0}}>Device Management</h3>
                                <p className="text-muted mb-0">Manage smart sensors and user assignments</p>
                            </Col>
                            <Col className="text-right" md="auto">
                                <Button color="success" onClick={openAddModal} style={{borderRadius: '20px', boxShadow: '0 2px 5px rgba(40, 167, 69, 0.3)'}}>
                                    + Add New Device
                                </Button>
                            </Col>
                        </Row>

                        {error && <Alert color="danger">{error}</Alert>}

                        <div className="table-responsive">
                            <Table hover className="align-middle">
                                <thead className="bg-light">
                                <tr>
                                    <th className="border-0">Full ID</th>
                                    <th className="border-0">Name</th>
                                    <th className="border-0">Max Cons.</th>
                                    <th className="border-0" style={{width: '35%'}}>Assigned users</th>
                                    <th className="border-0 text-right">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {devices.map(dev => (
                                    <tr key={dev.id}>
                                        <td style={{verticalAlign: 'middle'}}>
                                            <div style={{
                                                fontSize: '0.75rem',
                                                color: '#555',
                                                fontFamily: 'monospace',
                                                backgroundColor: '#f8f9fa',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                border: '1px solid #e9ecef',
                                                userSelect: 'all',
                                                cursor: 'text',
                                                width: 'fit-content'
                                            }}>
                                                {dev.id}
                                            </div>
                                        </td>

                                        <td style={{fontWeight: '500'}}>{dev.name}</td>
                                        <td>{dev.maxConsumption} kWh</td>

                                        <td style={{textAlign: 'center'}}>
                                            {dev.userId ? (
                                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                                    <div style={{textAlign: 'left'}}>
                                                        <Badge color="success" className="mr-2" style={{padding: '5px 10px'}}>Assigned</Badge>
                                                        <span style={{fontWeight: 'bold', fontSize: '0.9em', color: '#333'}}>
                                                            To: {getUserNameById(dev.userId)}
                                                        </span>
                                                    </div>
                                                    <Button color="warning" size="sm" onClick={() => openUnassignModalHandler(dev.id)} style={{borderRadius: '15px'}}>
                                                        Unassign
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                                    <div style={{textAlign: 'left'}}>
                                                        <Badge color="secondary" className="mr-2" style={{padding: '5px 10px'}}>Unassigned</Badge>
                                                    </div>
                                                    <Button color="success" size="sm" onClick={() => openAssignModalHandler(dev.id)} style={{borderRadius: '15px'}}>
                                                        Assign User
                                                    </Button>
                                                </div>
                                            )}
                                        </td>

                                        <td className="text-right">
                                            <Button color="light" size="sm" className="mr-2 text-primary" onClick={() => openEditModal(dev)} style={{marginRight: '5px', fontWeight: 'bold'}}>
                                                Edit
                                            </Button>
                                            <Button color="light" size="sm" className="text-danger" onClick={() => handleDeleteClick(dev.id)} style={{fontWeight: 'bold'}}>
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </div>
                    </CardBody>
                </Card>

                <Modal isOpen={modal} toggle={toggle} centered>
                    <ModalHeader toggle={toggle} className="border-0">{isEditMode ? 'Edit Device' : 'Add New Device'}</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label className="fw-bold">Device Name</Label>
                                <Input name="name" value={currentDevice.name} onChange={handleChange} />
                            </FormGroup>
                            <FormGroup>
                                <Label className="fw-bold">Max Hourly Consumption (kWh)</Label>
                                <Input type="number" name="maxConsumption" value={currentDevice.maxConsumption} onChange={handleChange} />
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter className="border-0">
                        <Button color="primary" onClick={handleSave} style={{borderRadius: '20px'}}>Save</Button>
                        <Button color="secondary" onClick={toggle} style={{borderRadius: '20px'}}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={deleteModal} toggle={toggleDeleteModal} centered>
                    <ModalHeader toggle={toggleDeleteModal} className="border-0 text-danger">Delete Device</ModalHeader>
                    <ModalBody>
                        Are you sure you want to delete this device? This action cannot be undone.
                    </ModalBody>
                    <ModalFooter className="border-0">
                        <Button color="danger" onClick={confirmDelete} style={{borderRadius: '20px'}}>Delete</Button>
                        <Button color="secondary" onClick={toggleDeleteModal} style={{borderRadius: '20px'}}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={unassignModal} toggle={toggleUnassignModal} centered>
                    <ModalHeader toggle={toggleUnassignModal} className="border-0 text-warning">Unassign Device</ModalHeader>
                    <ModalBody>
                        Are you sure you want to remove the owner from this device?
                    </ModalBody>
                    <ModalFooter className="border-0">
                        <Button color="warning" onClick={confirmUnassign} style={{borderRadius: '20px', color: 'white'}}>Confirm Unassign</Button>
                        <Button color="secondary" onClick={toggleUnassignModal} style={{borderRadius: '20px'}}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={assignModal} toggle={toggleAssignModal} centered>
                    <ModalHeader toggle={toggleAssignModal} className="border-0 text-success">Assign User to Device</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label className="fw-bold">Select Client:</Label>
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
                    <ModalFooter className="border-0">
                        <Button color="success" onClick={handleAssign} style={{borderRadius: '20px'}}>Assign User</Button>
                        <Button color="secondary" onClick={toggleAssignModal} style={{borderRadius: '20px'}}>Cancel</Button>
                    </ModalFooter>
                </Modal>

            </Container>
        </div>
    );
}

export default AdminDevices;