import React from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';


const NavigationBar = () => {
    const role = sessionStorage.getItem("role");

    return (
        <div style={{backgroundColor: '#fff'}}>
            <Navbar color="light" light expand="md">
                <NavbarBrand href="/">Energy Platform</NavbarBrand>
                <Nav className="mr-auto" navbar>


                    {role === 'ADMIN' && (
                        <>
                            <NavItem>
                                <NavLink href="/admin-users">Manage Users</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/admin-devices">Manage Devices</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/my-profile">My Profile</NavLink>
                            </NavItem>
                        </>
                    )}

                    {/* MENIU CLIENT */}
                    {role === 'CLIENT' && (
                        <>
                            <NavItem>
                                <NavLink href="/">Dashboard</NavLink>
                            </NavItem>
                            <NavItem>
                                {/* Buton Nou */}
                                <NavLink href="/my-profile">My Profile</NavLink>
                            </NavItem>
                        </>
                    )}


                </Nav>
            </Navbar>
        </div>
    );
};

export default NavigationBar;