import React, { Component, ChangeEvent } from 'react';
import './Camera.css'
import { Container, Form, Input, FormGroup, Label, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { IUserResponse } from '../api/model';
import { uploadImage } from '../api/feed';
import { Redirect } from 'react-router';
import Webcam from "react-webcam";
import '../styles/Camera.css'
import { dataURItoBlob } from '../api/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync, faCamera } from '@fortawesome/free-solid-svg-icons';

interface IProps {
  user:IUserResponse
}
interface IState {
  file: Blob | null
  tagsStr: string
  uploaded: boolean
  width: number,
  height: number,
  confirmOpen: boolean
  facingMode: "user" | "environment"
}


class Camera extends Component<IProps,IState> {
  private webcam : Webcam | null = null
  constructor(props: Readonly<IProps>){
    super(props)
    this.state = {
      file: null,
      tagsStr: "",
      uploaded: false,
      width:0,
      height:0,
      confirmOpen: false,
      facingMode:"environment"
    }
    this.capture = this.capture.bind(this)
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
  }
    
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }
  capture(){
    if(this.webcam){
      const file = dataURItoBlob(this.webcam.getScreenshot() as string)
      this.setState({file,confirmOpen:true})
    }
  }
  render() {
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode:this.state.facingMode
    };

    return (this.state.uploaded)?<Redirect to="/"/>:(
      <div>
        {(this.state.file)?[
          <img src={URL.createObjectURL(this.state.file)}/>,
          <br/>,
          <Input name="tags" type="text" placeholder="tag1 tag2 tag3..." onChange={e => this.setState({tagsStr:e.target.value})} value={this.state.tagsStr} />,
          <Button color="primary" onClick={() => {
            uploadImage(this.state.file as Blob,(this.state.tagsStr.length > 0)?this.state.tagsStr.split(' ').map(t => t.trim()):[]).then(() => {
              this.setState({confirmOpen:false,uploaded:true})
            })
          }}>Upload</Button>,
          ' ',
          <Button color="secondary" onClick={() => this.setState({file:null})}>Cancel</Button>
        ]:[
        <Webcam 
          key={"webcam"+this.state.facingMode}
          ref={webcam => {
            this.webcam = webcam
          }}
          
          audio={false}
          screenshotFormat="image/jpeg"
          width={1280}
          height={720}
          {...{videoConstraints,imageSmoothing:true,}}
        />,
        <Button key="swap" className="camButton" onClick={() => this.setState(({facingMode}) => ({facingMode:(facingMode === "user")?"environment":"user"}))}><FontAwesomeIcon icon={faSync}/></Button>,
        ' ',
        <Button key="capture" className="camButton" onClick={this.capture}><FontAwesomeIcon icon={faCamera}/></Button>]}
      </div>
    );
  }
}

export default Camera;