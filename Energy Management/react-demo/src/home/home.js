import React, { useState, useEffect } from 'react';
import {
    Container, Jumbotron, Row, Col, Card, CardBody,
    CardTitle, CardText, Input, Alert, Badge, Button
} from 'reactstrap';
import * as API_DEVICES from '../device/api/device-api';

const cardStyle = {
    textAlign: 'center',
    border: 'none',
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
    transition: '0.3s',
    height: '100%'
};

function Home() {
    const [devices, setDevices] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const username = sessionStorage.getItem("username") || "User";
    const userId = sessionStorage.getItem("userId");

    // --- 1. FETCH DATA & INIT STATUS ---
    useEffect(() => {
        if (userId) {
            API_DEVICES.getDevicesByUserId(userId, (result, status, err) => {
                if (result !== null && status === 200) {
                    // Add 'isActive' property locally
                    const devicesWithStatus = result.map(dev => ({
                        ...dev,
                        isActive: true // Default to active
                    }));

                    setDevices(devicesWithStatus);
                    setIsLoaded(true);
                } else {
                    setError("Could not load dashboard data.");
                    setIsLoaded(true);
                }
            });
        }
    }, [userId]);

    // --- TOGGLE LOGIC ---
    const toggleDeviceStatus = (id) => {
        const updatedDevices = devices.map(dev => {
            if (dev.id === id) {
                return { ...dev, isActive: !dev.isActive };
            }
            return dev;
        });
        setDevices(updatedDevices);
    };

    // --- 2. STATISTICS LOGIC ---
    const totalDevices = devices.length;

    // Sum only active devices
    const totalActiveConsumption = devices
        .filter(dev => dev.isActive)
        .reduce((acc, dev) => acc + dev.maxConsumption, 0);

    const activeDevicesList = devices.filter(d => d.isActive);
    const topConsumerDevice = activeDevicesList.length > 0
        ? activeDevicesList.reduce((prev, current) => (prev.maxConsumption > current.maxConsumption) ? prev : current)
        : { name: "None", maxConsumption: 0 };


    // --- 3. FILTER LOGIC ---
    const filteredDevices = devices.filter(dev =>
        dev.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <Jumbotron fluid style={{backgroundColor: '#007bff', color: 'white', padding: '40px', marginBottom: '30px'}}>
                <Container fluid>
                    <h1 className="display-4">Welcome, {username}!</h1>
                    <p className="lead">Manage your smart energy consumption in real-time.</p>
                </Container>
            </Jumbotron>

            <Container>
                {error && <Alert color="danger">{error}</Alert>}

                {/* STATISTICS CARDS */}
                <Row className="mb-5">
                    <Col md="4">
                        <Card style={{...cardStyle, borderLeft: '5px solid #17a2b8'}}>
                            <CardBody>
                                <CardTitle tag="h5" className="text-muted text-uppercase mb-2">Total Sensors</CardTitle>
                                <CardText className="display-4 font-weight-bold text-info">
                                    {totalDevices}
                                </CardText>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="4">
                        <Card style={{...cardStyle, borderLeft: '5px solid #28a745'}}>
                            <CardBody>
                                <CardTitle tag="h5" className="text-muted text-uppercase mb-2">Active Consumption</CardTitle>
                                <CardText className="display-4 font-weight-bold text-success">
                                    {totalActiveConsumption} <span style={{fontSize: '0.4em'}}>kWh</span>
                                </CardText>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="4">
                        <Card style={{...cardStyle, borderLeft: '5px solid #dc3545'}}>
                            <CardBody>
                                <CardTitle tag="h5" className="text-muted text-uppercase mb-2">Top Consumer</CardTitle>
                                <div style={{marginTop: '10px'}}>
                                    <h4 className="text-danger">{topConsumerDevice.name}</h4>
                                    <Badge color="danger">{topConsumerDevice.maxConsumption} kWh</Badge>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                <hr />

                {/* SEARCH BAR */}
                <Row className="mb-3 align-items-center">
                    <Col md="8">
                        <h3>Your Devices</h3>
                    </Col>
                    <Col md="4">
                        <Input
                            type="text"
                            placeholder="🔍 Search device..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{borderRadius: '20px'}}
                        />
                    </Col>
                </Row>

                {/* DEVICES LIST */}
                <Row>
                    {filteredDevices.length > 0 ? (
                        filteredDevices.map(dev => (
                            <Col sm="6" md="4" key={dev.id} className="mb-4">
                                <Card
                                    body
                                    outline
                                    color={dev.isActive ? "secondary" : "light"} // Slight visual change if inactive
                                    className="h-100 shadow-sm"
                                    style={{borderRadius: '15px', opacity: dev.isActive ? 1 : 0.6}}
                                >
                                    <CardBody>
                                        <CardTitle tag="h5" style={{fontWeight: 'bold', color: '#343a40'}}>
                                            {dev.name}
                                        </CardTitle>
                                        <hr/>
                                        <CardText>
                                            <strong>Max Consumption:</strong> {dev.maxConsumption} kWh
                                        </CardText>

                                        {/* STATUS LINE + BUTTON */}
                                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px'}}>

                                            {/* Left side: Status Text */}
                                            <span className="text-muted" style={{fontSize: '0.9em'}}>
                                                Status: <Badge color={dev.isActive ? "success" : "secondary"}>
                                                    {dev.isActive ? "Active" : "Inactive"}
                                                </Badge>
                                            </span>

                                            {/* Right side: Button */}
                                            <Button
                                                size="sm"
                                                color={dev.isActive ? "outline-danger" : "outline-success"}
                                                onClick={() => toggleDeviceStatus(dev.id)}
                                            >
                                                {dev.isActive ? "Deactivate" : "Activate"}
                                            </Button>
                                        </div>

                                    </CardBody>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col>
                            <Alert color="light" className="text-center">
                                No devices found.
                            </Alert>
                        </Col>
                    )}
                </Row>

            </Container>
        </div>
    );
}

export default Home;