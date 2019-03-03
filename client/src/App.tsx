import React, { Component } from 'react';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem, 
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  Input} from 'reactstrap';

import {Feed,Login,Settings} from "./routes"
import { IUser } from '../../common/objects';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faCog } from '@fortawesome/free-solid-svg-icons';

interface IState {
  isOpen : boolean
  user: IUser | null
  loginOpen: boolean
}

class App extends Component<{},IState> {
  constructor(props: Readonly<{}>) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.toggleLogin = this.toggleLogin.bind(this);
    this.state = {
      isOpen: false,
      user: {
        id: "0",
        username: "Test",
        password: "test",
        isHashed: false
      },
      loginOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  toggleLogin(){
    this.setState({
      loginOpen: !this.state.loginOpen
    });
  }
  render() {
    return (
      <Router>
      <div className="App">
        <Navbar color="light" light expand="xs" fixed="top">
          <NavbarBrand tag={Link} to="/">PikPak</NavbarBrand>
          <Nav navbar class="mr-auto">
              <NavItem>
                <NavLink href="#" onClick={this.toggleLogin}><FontAwesomeIcon icon={faSignInAlt}/></NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/settings"><FontAwesomeIcon icon={faCog}/></NavLink>
              </NavItem>
            </Nav>
        </Navbar>
        <Route path="/" exact component={Feed} />
        {(this.state.user !== null)?<Route path="/settings/" render={(props) => <Settings {...props} user={this.state.user as IUser} />} />:[]}
        
        <Modal isOpen={this.state.loginOpen} toggle={this.toggleLogin} centered>
          <ModalHeader toggle={this.toggleLogin}>Login</ModalHeader>
            <ModalBody>
              <Form>
                <Input name="username" type="text" placeholder="username"/>
                <Input name="password" type="password" placeholder="password"/>
              </Form>
            </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggleLogin}>Login</Button>{' '}
            <Button color="secondary" onClick={this.toggleLogin}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
      </Router>
      
    );
  }
}

export default App;
