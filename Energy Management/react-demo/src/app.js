import React from 'react'
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'
import NavigationBar from './navigation-bar'
import Home from './home/home';
import PersonContainer from './person/person-container'

import ErrorPage from './commons/errorhandling/error-page';
import styles from './commons/styles/project-style.css';
import Login from './login/Login'; // Importam componenta de Login creata anterior
import AdminUsers from './person/AdminUsers';
import AdminDevices from './device/AdminDevices';
import MyProfile from './person/MyProfile';




class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false // Starea initiala: neautentificat
        };
        // Trebuie sa facem bind la functii ca sa poata folosi "this"
        this.handleLoginSuccess = this.handleLoginSuccess.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    // Aceasta functie se apeleaza automat cand se incarca aplicatia
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

        // Luam rolul din sesiune (asigura-te ca l-ai salvat in Login.js!)
        const role = sessionStorage.getItem("role");

        // Daca ESTE autentificat, afisam aplicatia normala (Router-ul)
        return (
            <div className={styles.back}>
                {/* Buton temporar de logout ca sa poti testa iesirea */}
                <div style={{position: 'absolute', top: '10px', right: '10px', zIndex: 999}}>
                    <button onClick={this.handleLogout} className="btn btn-danger btn-sm">Sign Out</button>
                </div>

                <Router>
                    <div>
                        <NavigationBar />
                        <Switch>

                            {/* RUTA SMART PENTRU HOME */}
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

                            {/* Schimbam path-ul in ceva mai clar */}
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
                                    // Permitem accesul oricui este logat (indiferent de rol)
                                    this.state.isAuthenticated ? <MyProfile/> : <Redirect to="/" />
                                )}
                            />




                            {/*Error*/}
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

export default App