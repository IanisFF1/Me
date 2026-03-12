import React, { useState, useEffect } from 'react';
import { Container, Card, CardBody, Input, Label, Row, Col } from 'reactstrap';
import * as API_DEVICES from './api/device-api';
// Importam bibliotecile de WebSocket
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';

function EnergyChart(props) {
    const deviceId = props.match.params.id;
    const [allMeasurements, setAllMeasurements] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [isLoaded, setIsLoaded] = useState(false);

    const [maxLimit, setMaxLimit] = useState(0);

    const pageStyle = {
        minHeight: '100vh',
        backgroundColor: '#f4f7f6',
        paddingTop: '20px',
        paddingBottom: '20px'
    };

    useEffect(() => {
        API_DEVICES.getMeasurements(deviceId, (result, status, err) => {
            if (result !== null && status === 200) {
                setAllMeasurements(result);
                setIsLoaded(true);
            } else {
                console.error("Eroare la incarcarea datelor:", err);
                setIsLoaded(true);
            }
        });

        if (API_DEVICES.getDeviceById) {
            API_DEVICES.getDeviceById(deviceId, (result, status, err) => {
                if(result && status === 200) {
                    console.log("Device details received:", result);

                    if (result.maxConsumption) {
                        setMaxLimit(result.maxConsumption);
                    } else {
                        console.warn("Atentie: maxConsumption lipseste din obiectul device!", result);
                    }
                } else {
                    console.error("Eroare la fetch device details:", err);
                }
            });
        } else {
            console.error("Functia API_DEVICES.getDeviceById nu este definita in device-api.js!");
        }

    }, [deviceId]);

    useEffect(() => {
        // Conexiune prin Traefik (port 80 -> /ws)
        const socket = new SockJS('http://localhost/ws');
        const stompClient = Stomp.over(socket);
        stompClient.debug = null;

        stompClient.connect({}, () => {
            stompClient.subscribe('/topic/device/' + deviceId, (message) => {
                const newMeasurement = JSON.parse(message.body);
                console.log("Noua masuratoare primita pe socket:", newMeasurement);
                setAllMeasurements(prevMeasurements => [...prevMeasurements, newMeasurement]);
            });
        }, (err) => {
            console.log("Eroare conexiune WebSocket:", err);
        });

        return () => {
            if (stompClient && stompClient.connected) {
                stompClient.disconnect();
            }
        };
    }, [deviceId]);

    useEffect(() => {
        if (allMeasurements.length > 0) {
            processDataForDay(selectedDate);
        }
    }, [selectedDate, allMeasurements]);

    const processDataForDay = (dateString) => {
        const hourlyData = Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            hourLabel: `${i}:00`,
            value: 0
        }));

        const selectedDateObj = new Date(dateString);

        allMeasurements.forEach(item => {
            const itemDate = new Date(item.timestamp);
            const isSameDay =
                itemDate.getDate() === selectedDateObj.getDate() &&
                itemDate.getMonth() === selectedDateObj.getMonth() &&
                itemDate.getFullYear() === selectedDateObj.getFullYear();

            if (isSameDay) {
                const hour = itemDate.getHours();
                hourlyData[hour].value += item.measurementValue;
            }
        });

        hourlyData.forEach(data => {
            data.value = parseFloat(data.value.toFixed(1));
        });

        setChartData(hourlyData);
    };

    return (
        <div style={pageStyle}>
            <Container>
                <h2 className="text-center mb-4">Energy Consumption History</h2>

                <Card className="shadow-sm">
                    <CardBody>
                        <Row className="mb-4 justify-content-center">
                            <Col md={4} className="text-center">
                                <Label for="dateSelect" className="fw-bold">Pick the day:</Label>
                                <Input
                                    type="date"
                                    id="dateSelect"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                />
                            </Col>
                        </Row>

                        <p className="text-center text-info">
                            Hourly Limit: <strong>{maxLimit} kWh</strong>
                        </p>

                        <div style={{ width: '100%', height: 400 }}>
                            {isLoaded ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={chartData}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />

                                        <XAxis
                                            dataKey="hourLabel"
                                            interval={0}
                                            tick={{ fontSize: 12 }}
                                        />


                                        <YAxis
                                            label={{ value: 'kWh', angle: -90, position: 'insideLeft' }}
                                            domain={[0, dataMax => Math.max(dataMax, maxLimit ? maxLimit : 0)]}
                                        />

                                        <Tooltip
                                            cursor={{ fill: 'transparent' }}
                                            formatter={(value) => `${value.toFixed(1)} kWh`}
                                        />                                        <Legend />

                                        {maxLimit > 0 && (
                                            <ReferenceLine
                                                y={maxLimit}
                                                label={{ value: `LIMIT: ${maxLimit}`, position: 'top', fill: 'red', fontSize: 14 }}
                                                stroke="red"
                                                strokeDasharray="3 3"
                                                strokeWidth={2}
                                                isFront={true}
                                            />
                                        )}

                                        <Bar
                                            dataKey="value"
                                            name="Consum (kWh)"
                                            fill="#8884d8"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-center">Data is loading...</p>
                            )}
                        </div>
                    </CardBody>
                </Card>
            </Container>
        </div>
    );
}

export default EnergyChart;