import React, { Component } from 'react';
import { Container, Form, Input, FormGroup, Label, Col } from 'reactstrap';
import { IUserResponse } from '../api/model';

interface IProps {
  user:IUserResponse
}


class Settings extends Component<IProps,{}> {
  render() {
    return (
      <Container>
        <Form onSubmit={e => e.preventDefault()}>
          <FormGroup row>
            <Col sm="2">
            <Label for="username">Username</Label>
            </Col>
            <Col sm="10">
              <Input name="username" type="text" value={this.props.user.username}/>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm="2">
            <Label for="password">Password</Label>
            </Col>
            <Col sm="10">
              <Input name="password" type="password"/>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm="2">
            <Label for="passwordRepeat">Password(repeat)</Label>
            </Col>
            <Col sm="10">
              <Input name="passwordRepeat" type="password"/>
            </Col>
          </FormGroup>
          <Input type="submit" value="Update"/>
        </Form>
      </Container>
    );
  }
}

export default Settings;