import React, { Component, ChangeEvent } from 'react';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  Input
} from 'reactstrap';

import { Feed, Settings } from "./routes"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faCog, faCamera } from '@fortawesome/free-solid-svg-icons';
import { login, register, logout, getCurrentUser } from './api/auth';
import { IUserResponse } from './api/model';
import Camera from './routes/Camera';

interface IState {
  loginusername: string,
  loginpassword: string,
  registerusername: string,
  registerpassword: string
  registerpasswordconf: string
  user: IUserResponse | null
  loginOpen: boolean
  registerOpen: boolean
}

class App extends Component<{}, IState> {
  constructor(props: Readonly<{}>) {
    super(props);
    this.toggleLogin = this.toggleLogin.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.toggleRegister = this.toggleRegister.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.handleChangePasswordLogin = this.handleChangePasswordLogin.bind(this)
    this.handleChangeUsernameLogin = this.handleChangeUsernameLogin.bind(this)
    this.handleChangeUsernameRegister = this.handleChangeUsernameRegister.bind(this)
    this.handleChangePasswordRegister = this.handleChangePasswordRegister.bind(this)
    this.handleChangePasswordConfirmRegister = this.handleChangePasswordConfirmRegister.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this.state = {
      loginpassword: "",
      loginusername: "",
      registerpassword: "",
      registerpasswordconf: "",
      registerusername: "",
      user: null,
      loginOpen: false,
      registerOpen: false
    };
    getCurrentUser().then(user => this.setState({user}))
  }
  toggleLogin() {
    this.setState({
      loginOpen: !this.state.loginOpen
    });
  }

  handleLogin() {
    login(this.state.loginusername, this.state.loginpassword).then(user => {
      this.setState(() => ({ user }))
    }).finally(() => {
      this.toggleLogin()
    })
  }
  handleLogout() {
    logout().then(() => this.setState({user:null}))
  }
  toggleRegister() {
    this.setState({
      registerOpen: !this.state.registerOpen
    });
  }

  handleRegister() {
    if(this.state.registerpassword === this.state.registerpasswordconf){
      register(this.state.registerusername, this.state.registerpassword).then(resp => {
        alert(`You have registered user ${resp.username}`)
      }).finally(() => {
        this.toggleRegister()
      })
    }
  }

  handleChangeUsernameLogin(e: ChangeEvent<HTMLInputElement>) {
    this.setState({ loginusername: e.target.value })
  }

  handleChangePasswordLogin(e: ChangeEvent<HTMLInputElement>) {
    this.setState({ loginpassword: e.target.value })
  }

  handleChangeUsernameRegister(e: ChangeEvent<HTMLInputElement>) {
    this.setState({ registerusername: e.target.value })
  }

  handleChangePasswordRegister(e: ChangeEvent<HTMLInputElement>) {
    this.setState({ registerpassword: e.target.value })
  }

  handleChangePasswordConfirmRegister(e: ChangeEvent<HTMLInputElement>) {
    this.setState({ registerpasswordconf: e.target.value })
  }
  
  render() {
    return (
      <Router
        forceRefresh={true}
      >
        <div className="App">
          <Navbar color="light" light expand="xs" sticky="top">
            <NavbarBrand tag={Link} to="/" className="mr-auto">PikPak</NavbarBrand>
            <Nav navbar >

              {(!this.state.user) ?[
              <NavItem>
                <NavLink href="#" onClick={this.toggleLogin}>Login</NavLink>
              </NavItem>,
              <NavItem>
                <NavLink href="#" onClick={this.toggleRegister}>Register</NavLink>
              </NavItem>,
              ]
                : [
                  <NavItem key="n1">
                    <NavLink href="#" onClick={this.handleLogout}>Logout</NavLink>
                  </NavItem>,
                  <NavItem key="n2">
                  <NavLink tag={Link} to="/settings"><FontAwesomeIcon icon={faCog} /></NavLink>
                </NavItem>,
                  <NavItem key="n3">
                  <NavLink tag={Link} to="/camera"><FontAwesomeIcon icon={faCamera} /></NavLink>
                </NavItem>
                ]}
              
              {(this.state.user) ?
                <NavItem>
                  {this.state.user.username}
                </NavItem>
                : []}
            </Nav>
          </Navbar>
          <Route path="/" exact render={(props) => <Feed {...props} key={(this.state.user)?`user${this.state.user.id}feed`:'loggedoutfeed'} />}/>
          {(this.state.user) ? <Route path="/settings/" render={(props) => <Settings {...props} user={this.state.user as IUserResponse} />} /> : []}
          {(this.state.user) ? <Route path="/camera/" component={Camera} /> : []}

          <Modal isOpen={this.state.loginOpen} toggle={this.toggleLogin} centered>
            <ModalHeader toggle={this.toggleLogin}>Login</ModalHeader>
            <ModalBody>
              <Form>
                <Input name="loginusername" type="text" placeholder="username" onChange={this.handleChangeUsernameLogin} value={this.state.loginusername} />
                <Input name="loginpassword" type="password" placeholder="password" onChange={this.handleChangePasswordLogin} value={this.state.loginpassword} />
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.handleLogin}>Login</Button>{' '}
              <Button color="secondary" onClick={this.toggleLogin}>Cancel</Button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={this.state.registerOpen} toggle={this.toggleRegister} centered>
            <ModalHeader toggle={this.toggleRegister}>Login</ModalHeader>
            <ModalBody>
              <Form>
                <Input name="registerusername" type="text" placeholder="username" onChange={this.handleChangeUsernameRegister} value={this.state.registerusername} />
                <Input name="registerpassword" type="password" placeholder="password" onChange={this.handleChangePasswordRegister} value={this.state.registerpassword} />
                <Input name="registerpasswordconf" type="password" placeholder="repeat password" onChange={this.handleChangePasswordConfirmRegister} value={this.state.registerpasswordconf} />
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.handleRegister}>Register</Button>{' '}
              <Button color="secondary" onClick={this.toggleRegister}>Cancel</Button>
            </ModalFooter>
          </Modal>
        </div>
      </Router>

    );
  }
}

export default App;
