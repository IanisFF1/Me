import React, { useState, useEffect } from 'react';
import {
    Container, Jumbotron, Row, Col, Card, CardBody,
    CardTitle, CardText, Input, Alert, Badge, Button
} from 'reactstrap';
import * as API_DEVICES from '../device/api/device-api';
// --- IMPORT NOU ---
import ChatWindow from "../chat/ChatWindow";

const cardStyle = {
    textAlign: 'center',
    border: 'none',
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
    transition: '0.3s',
    height: '100%'
};


const ADMIN_ID = "8c80d7e0-ca30-484c-b1f4-193ca8c5891d";

function Home() {
    const [devices, setDevices] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [isChatOpen, setIsChatOpen] = useState(false);

    const username = sessionStorage.getItem("username") || "User";
    const userId = sessionStorage.getItem("userId");

    const pageStyle = {
        minHeight: '100vh',
        backgroundColor: '#f4f7f6',
        paddingBottom: '40px'
    };

    useEffect(() => {
        if (userId) {
            API_DEVICES.getDevicesByUserId(userId, (result, status, err) => {
                if (result !== null && status === 200) {
                    const devicesWithStatus = result.map(dev => ({
                        ...dev,
                        isActive: true
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

    const toggleDeviceStatus = (id) => {
        const updatedDevices = devices.map(dev => {
            if (dev.id === id) {
                return { ...dev, isActive: !dev.isActive };
            }
            return dev;
        });
        setDevices(updatedDevices);
    };

    const goToChart = (deviceId) => {
        window.location.href = `/energy-chart/${deviceId}`;
    };

    const totalDevices = devices.length;

    const totalActiveConsumption = devices
        .filter(dev => dev.isActive)
        .reduce((acc, dev) => acc + dev.maxConsumption, 0);

    const activeDevicesList = devices.filter(d => d.isActive);
    const topConsumerDevice = activeDevicesList.length > 0
        ? activeDevicesList.reduce((prev, current) => (prev.maxConsumption > current.maxConsumption) ? prev : current)
        : { name: "None", maxConsumption: 0 };


    const filteredDevices = devices.filter(dev =>
        dev.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={pageStyle}>

            <Jumbotron fluid style={{backgroundColor: '#007bff', color: 'white', padding: '40px 0', marginBottom: '40px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}}>
                <Container>
                    <h1 className="display-4">Welcome, {username}!</h1>
                    <p className="lead">Manage your smart energy consumption in real-time.</p>
                </Container>
            </Jumbotron>

            <Container>
                {error && <Alert color="danger">{error}</Alert>}

                <Row className="mb-5">
                    <Col md="4" className="mb-3">
                        <Card style={{...cardStyle, borderLeft: '5px solid #17a2b8'}}>
                            <CardBody>
                                <CardTitle tag="h5" className="text-muted text-uppercase mb-2">Total Sensors</CardTitle>
                                <CardText className="display-4 font-weight-bold text-info">
                                    {totalDevices}
                                </CardText>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="4" className="mb-3">
                        <Card style={{...cardStyle, borderLeft: '5px solid #28a745'}}>
                            <CardBody>
                                <CardTitle tag="h5" className="text-muted text-uppercase mb-2">Active Consumption</CardTitle>
                                <CardText className="display-4 font-weight-bold text-success">
                                    {totalActiveConsumption} <span style={{fontSize: '0.4em'}}>kWh</span>
                                </CardText>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="4" className="mb-3">
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

                <hr style={{borderColor: '#ccc'}} />

                <Row className="mb-4 align-items-center">
                    <Col md="8">
                        <h3 style={{color: '#333'}}>Your Devices</h3>
                    </Col>
                    <Col md="4">
                        <Input
                            type="text"
                            placeholder="🔍 Search device..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{borderRadius: '20px', border: '1px solid #ced4da'}}
                        />
                    </Col>
                </Row>

                <Row>
                    {filteredDevices.length > 0 ? (
                        filteredDevices.map(dev => (
                            <Col sm="6" md="4" key={dev.id} className="mb-4">
                                <Card
                                    body
                                    className="h-100 shadow-sm border-0"
                                    style={{
                                        borderRadius: '15px',
                                        opacity: dev.isActive ? 1 : 0.7,
                                        backgroundColor: 'white',
                                        transition: 'transform 0.2s'
                                    }}
                                >
                                    <CardBody>
                                        <div className="d-flex justify-content-between align-items-start">
                                            <CardTitle tag="h5" style={{fontWeight: 'bold', color: '#343a40'}}>
                                                {dev.name}
                                            </CardTitle>
                                            <div style={{
                                                width: '12px',
                                                height: '12px',
                                                borderRadius: '50%',
                                                backgroundColor: dev.isActive ? '#28a745' : '#6c757d'
                                            }}></div>
                                        </div>

                                        <hr className="my-3"/>

                                        <CardText className="text-muted mb-4">
                                            Max limit: <strong className="text-dark">{dev.maxConsumption} kWh</strong>
                                        </CardText>

                                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                            <Button
                                                size="sm"
                                                color={dev.isActive ? "outline-danger" : "outline-success"}
                                                onClick={() => toggleDeviceStatus(dev.id)}
                                                style={{borderRadius: '20px', paddingLeft: '15px', paddingRight: '15px'}}
                                            >
                                                {dev.isActive ? "Turn Off" : "Turn On"}
                                            </Button>

                                            <Button
                                                size="sm"
                                                color="primary"
                                                onClick={() => goToChart(dev.id)}
                                                style={{borderRadius: '20px', boxShadow: '0 2px 5px rgba(0,123,255,0.3)'}}
                                            >
                                                History 📈
                                            </Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col>
                            <Alert color="light" className="text-center shadow-sm border-0">
                                No devices found matching your search.
                            </Alert>
                        </Col>
                    )}
                </Row>
            </Container>

            {!isChatOpen && (
                <Button
                    color="primary"
                    className="shadow-lg"
                    style={{
                        position: 'fixed',
                        bottom: '30px',
                        right: '30px',
                        borderRadius: '50%',
                        width: '60px',
                        height: '60px',
                        fontSize: '24px',
                        zIndex: 999
                    }}
                    onClick={() => setIsChatOpen(true)}
                >
                    💬
                </Button>
            )}

            {isChatOpen && (
                <ChatWindow
                    onClose={() => setIsChatOpen(false)}
                    myUserId={userId}
                    otherUserId={ADMIN_ID}
                    otherUserName="Support"
                    role="CLIENT"
                />
            )}

        </div>
    );
}

export default Home;