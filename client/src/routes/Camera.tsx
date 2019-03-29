import React, { Component, ChangeEvent } from 'react';
import { Container, Form, Input, FormGroup, Label, Col } from 'reactstrap';
import { IUserResponse } from '../api/model';
import { uploadImage } from '../api/feed';
import { Redirect } from 'react-router';

interface IProps {
  user:IUserResponse
}
interface IState {
  file:string | Blob | null
  tagsStr: string
  uploaded: boolean
}


class Camera extends Component<IProps,IState> {
  constructor(props: Readonly<IProps>){
    super(props)
    this.state = {
      file: null,
      tagsStr: "",
      uploaded: false
    }
  }
  render() {
    return (this.state.uploaded)?<Redirect to="/"/>:(
      <Container>
        <Form onSubmit={e => {
            if(this.state.file){
              uploadImage(this.state.file,this.state.tagsStr.split(',').map(t => t.trim())).then(() => {
                alert('uploaded succesfully')
                this.setState({uploaded:true})
              })
            }
            e.preventDefault()
          }}>
          <FormGroup row>
            <Col sm="2">
            <Label for="file">Image File</Label>
            </Col>
            <Col sm="10">
              <Input name="file" type="file" accept="image/*" onChange={(e : ChangeEvent<HTMLInputElement>) => {
                if(e.target.files) {
                  this.setState({file:e.target.files[0]});
                } else {
                  this.setState({file:null})
                }
              }}/>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm="2">
            <Label for="tags">Tags</Label>
            </Col>
            <Col sm="10">
              <Input name="tags" type="text" value={this.state.tagsStr} onChange={(e) => this.setState({tagsStr:e.target.value})}/>
            </Col>
          </FormGroup>
          <Input type="submit" value="Update"/>
        </Form>
      </Container>
    );
  }
}

export default Camera;