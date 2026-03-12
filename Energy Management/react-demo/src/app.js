import React from 'react'
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'
import NavigationBar from './navigation-bar'
import Home from './home/home';

import ErrorPage from './commons/errorhandling/error-page';
import styles from './commons/styles/project-style.css';
import Login from './login/Login';
import AdminUsers from './person/AdminUsers';
import AdminDevices from './device/AdminDevices';
import MyProfile from './person/MyProfile';
import EnergyChart from './device/EnergyChart';
import WebSocketComp from './websocket/WebSocketComp';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false
        };
        this.handleLoginSuccess = this.handleLoginSuccess.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount() {
        const token = sessionStorage.getItem("token");
        if (token) {
            this.setState({ isAuthenticated: true });
        }
    }

    handleLoginSuccess() {
        this.setState({ isAuthenticated: true });
    }

    handleLogout() {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
        sessionStorage.removeItem("user");
        this.setState({ isAuthenticated: false });
    }

    render() {
        if (!this.state.isAuthenticated) {
            return (
                <div className={styles.back}>
                    <Login onLoginSuccess={this.handleLoginSuccess} />
                </div>
            );
        }

        const role = sessionStorage.getItem("role");

        return (
            <div className={styles.back}>
                <WebSocketComp />

                <div style={{position: 'absolute', top: '10px', right: '10px', zIndex: 999}}>
                    <button onClick={this.handleLogout} className="btn btn-danger btn-sm">Sign Out</button>
                </div>

                <Router>
                    <div>
                        <NavigationBar />
                        <Switch>

                            <Route
                                exact
                                path='/'
                                render={() => {
                                    if (role === 'ADMIN') {
                                        return <Redirect to="/admin-users" />;
                                    }
                                    return <Home />;
                                }}
                            />

                            <Route
                                exact
                                path='/admin-users'
                                render={() => (
                                    role === 'ADMIN' ? <AdminUsers/> : <Redirect to="/" />
                                )}
                            />

                            <Route
                                exact
                                path='/admin-devices'
                                render={() => (
                                    sessionStorage.getItem("role") === 'ADMIN' ? <AdminDevices/> : <Redirect to="/" />
                                )}
                            />

                            <Route
                                exact
                                path='/my-profile'
                                render={() => (
                                    this.state.isAuthenticated ? <MyProfile/> : <Redirect to="/" />
                                )}
                            />

                            <Route
                                exact
                                path='/energy-chart/:id'
                                render={(props) => (
                                    this.state.isAuthenticated ? <EnergyChart {...props}/> : <Redirect to="/" />
                                )}
                            />

                            <Route
                                exact
                                path='/error'
                                render={() => <ErrorPage/>}
                            />

                            <Route render={() =><ErrorPage/>} />
                        </Switch>
                    </div>
                </Router>
            </div>
        )
    };
}

export default App;