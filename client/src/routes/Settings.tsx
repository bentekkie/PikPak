import React, { Component, ChangeEvent } from 'react';
import { Container, Form, Input, FormGroup, Label, Col, Button } from 'reactstrap';
import { IUserResponse, IUser } from '../api/model';
import { updateUser, getCurrentUser } from '../api/auth';

interface IProps {
  user:IUserResponse
}
type IState = Partial<IUser> & {
  gore ?: boolean
  porn ?: boolean
  drugs ?: boolean
  passwordRepeat ?: string
  prevUser:IUserResponse
}


class Settings extends Component<IProps,IState> {

  constructor(props: Readonly<IProps>){
    super(props)
    this.state = {
      username:"",
      password:"",
      passwordRepeat:"",
      prevUser:props.user
    }
    getCurrentUser().then((prevUser : IUserResponse ) => this.setState({
      prevUser,
      username:prevUser.username,
      gore:prevUser.nsfwtags.includes("gore"),
      porn:prevUser.nsfwtags.includes("porn"),
      drugs:prevUser.nsfwtags.includes("drugs")
    }))
  }

  render() {
    return (
      <Container className="mt-5">
        <Form autocomplete="off" onSubmit={(e : React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          let update : Partial<IUser> = {}
          if(this.props.user.username !== this.state.username && this.state.username && this.state.username.length > 0){
            update.username = this.state.username;
          }
          if(this.state.password === this.state.passwordRepeat && this.state.password && this.state.password.length > 0){
            update.password = this.state.password;
          }
          let nsfwarr : string[] = []
          if(this.state.gore) nsfwarr.push("gore")
          if(this.state.porn) nsfwarr.push("porn")
          if(this.state.drugs) nsfwarr.push("drugs")
          update.nsfwtags = nsfwarr.join(",")
          updateUser(update).then(user => alert("User updated"+JSON.stringify(user)))
        }}>
        <input type="hidden" value="prayer" autoComplete="off" />
          <FormGroup row>
            <Col sm="2">
            <Label for="username">Username</Label>
            </Col>
            <Col sm="10">
              <Input disabled autoComplete="off" name="username" type="text" value={this.state.username} onChange={e => this.setState({username:e.target.value})}/>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm="2">
            <Label for="password">Password</Label>
            </Col>
            <Col sm="10">
              <Input  autoComplete="new-password" name="password" type="password" value={this.state.password} onChange={e => this.setState({password:e.target.value})} invalid={this.state.password !== this.state.passwordRepeat} valid={this.state.password === this.state.passwordRepeat}/>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm="2">
            <Label for="passwordRepeat">Password(repeat)</Label>
            </Col>
            <Col sm="10">
              <Input autoComplete="new-password" name="passwordRepeat" type="password" value={this.state.passwordRepeat} onChange={e => this.setState({passwordRepeat:e.target.value})} invalid={this.state.password !== this.state.passwordRepeat} valid={this.state.password === this.state.passwordRepeat}/>
            </Col>
          </FormGroup>

          <FormGroup check> 
            <Label check> 
              <Input type="checkbox" name="nsfw-porn" checked={this.state.porn} onChange={e => this.setState({porn:e.target.checked})} />{' '} Porn
            </Label> 
            <br/>
            <Label check> 
              <Input type="checkbox" name="nsfw-gore" checked={this.state.gore} onChange={e => this.setState({gore:e.target.checked})}  />{' '} Gore
            </Label> 
            <br/>
            <Label check> 
              <Input type="checkbox" name="nsfw-drugs" checked={this.state.drugs} onChange={e => this.setState({drugs:e.target.checked})}  />{' '} Drugs
            </Label> 
            <br/>
          </FormGroup>
          <FormGroup row>
          <Col xs="6">
          <Input type="submit" value="Update"/>
          </Col>
          <Col xs="6">
          <Button block onClick={() => this.setState({
            username:this.state.prevUser.username,
            password:"",
            passwordRepeat:"",
            gore:this.state.prevUser.nsfwtags.includes("gore"),
            porn:this.state.prevUser.nsfwtags.includes("porn"),
            drugs:this.state.prevUser.nsfwtags.includes("drugs")
          })}>Reset</Button>
          </Col>

          </FormGroup>
        </Form>
      </Container>
    );
  }
}

export default Settings;