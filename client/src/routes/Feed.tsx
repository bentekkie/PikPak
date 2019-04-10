import React, { Component, ComponentType, StatelessComponent } from 'react';
import './Feed.css'
import '../styles/tags.css'
import {IUpvoteInfo, IUser} from '../objects'
import InfiniteScroll  from 'react-infinite-scroll-component';
import { getPosts, getUpvoteInfo, upvote, downvote, getTags } from '../api/feed';
import LazyLoad from 'react-lazyload';
import { Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
import { IPost, IUserResponse } from '../api/model';
import ReactTags from 'react-tag-autocomplete'
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'
import { generateAutocompleteRenderInput, getLocation } from '../api/utils';

import { getCurrentUser } from '../api/auth';
import { isImgOk } from '../api/utils';
interface IState {
    posts : IPost[],
    upvoteInfo: IUpvoteInfo,
    hasMore: boolean,
    page : number,
    pageSize : number,
    filterTags: string[],
    sugestions:{
      id:number,
      name:string
    }[],
    settings?: IUserResponse,
    currentLocation: Coordinates
}

const InfiniteScrollFix : React.ComponentType<InfiniteScroll.InfiniteScrollProps & {className?:string}> = InfiniteScroll as any

class Feed extends Component<{},IState> {
  height= window.innerHeight/2;
  constructor(props: Readonly<{}>){
    super(props)
    this.next = this.next.bind(this);
    this.state = {
      posts:[],
      upvoteInfo:{
        downvotes:[],
        upvotes:[]
      },
      page: 0,
      pageSize: 10,
      hasMore: true,
      filterTags:[],
      sugestions:[],
      currentLocation: null
    }
    getTags().then((tags) => tags.map(tag => ({
      id:tag.id as number,
      name:tag.value
    }))).then(sugestions => this.setState({sugestions}))
    getCurrentUser().then(settings => this.setState({settings}))
    this.addTag = this.addTag.bind(this);
    this.next = this.next.bind(this);
  }
  
  next(){
    if(this.state.filterTags.length > 0){
      getPosts(this.state.page,this.state.pageSize,this.state.currentLocation,this.state.filterTags).then(({hasMore,newPosts}) => {
        const newLength = this.state.posts.length + newPosts.length
        this.setState(({posts,page}) => ({posts:[...posts,...newPosts],hasMore,page:page+1}))
        if(newLength*this.height < window.innerHeight && hasMore){
          this.next()
        }
      },
      (error) => {
        
      })
    }else{
      getPosts(this.state.page,this.state.pageSize,this.state.currentLocation).then(({hasMore,newPosts}) => {
        const newLength = this.state.posts.length + newPosts.length
        this.setState(({posts,page}) => ({posts:[...posts,...newPosts],hasMore,page:page+1}))
        if(newLength*this.height < window.innerHeight && hasMore){
          this.next()
        }
      },
      (error) => {
        
      })
    }
   
  }
    
  componentDidMount() {
    getLocation().then(position => this.setState({currentLocation:position.coords})).then(this.next)
    getUpvoteInfo().then(upvoteInfo => this.setState({upvoteInfo}))
  }

  addTag(tag : string){
    this.setState(({filterTags}) => ({filterTags:[...filterTags,tag]}),() => {
      this.setState({
        posts:[],
        page:0
      },() => this.next())
    })
  }
  

  render() {
    return (
      <Row>
        <Col>
        
          <Col>
          <TagsInput
          value={this.state.filterTags}
          onChange={filterTags=>{
            this.setState({filterTags},() => {
              this.setState({
                posts:[],
                page:0
              },() => this.next())

            })
          }}
          renderInput={generateAutocompleteRenderInput(this.state.sugestions)}
          />

          </Col>
        
          
          <InfiniteScrollFix
            dataLength={this.state.posts.length}
            hasMore={this.state.hasMore}
            next={this.next}
            loader={<h4>Loading...</h4>}
            style={{width:"100%"}}
            className={"container"}
            endMessage={<h4>All done.</h4>}
          >
            {this.state.posts.map(post => <Row key={`row${post.id}`}>
            <Col xs="12" lg={{size:"6",offset:"3"}}>
              <this.Post post={post} key={`post${post.id}`}/>
            </Col>
            </Row>)}
          </InfiniteScrollFix>
        </Col>
      </Row>
    );
  }
  Post : StatelessComponent<{post:IPost}> = (props) => 
  <div className="post">
    <div className="postInner">
      <LazyLoad offset={this.height*2}>
        <img className={"col-12 p-2 "+(isImgOk((this.state.settings)?this.state.settings.nsfwtags:"",props.post.nsfwTags)?"":"blurred")} src={`/api/image/imageFile/${props.post.id}.jpeg`}/>
      </LazyLoad>
      <div>
        {(props.post.tags)?props.post.tags.map(tag => <a onClick={() => this.addTag(tag)} key={tag} href="#" className="tag">#{tag}</a>):[]}
        {(props.post.nsfwTags)?props.post.nsfwTags.map(tag => (tag.length > 0)?<a key={tag} href="#" className="tag">#{tag}</a>:[]):[]}
        <div className="vote row mr-2">
          <a onClick={() => upvote(props.post.id).then(post => this.setState(({posts}) => {
            const i = posts.findIndex(({id}) => id === post.id)
            posts[i] = post
            return {posts}
          })).then(() => getUpvoteInfo()).then(upvoteInfo => this.setState({upvoteInfo}))}>
            <FontAwesomeIcon
              size={"2x"} 
              icon={faCaretUp} 
              style={{color:(this.state.upvoteInfo.upvotes.find(id => id === props.post.id))?"green":"black"}}/>
          </a>
          <div className="voteNum">{props.post.votes}</div>
          <a onClick={() => downvote(props.post.id).then(post => this.setState(({posts}) => {
            const i = posts.findIndex(({id}) => id === post.id)
            posts[i] = post
            return {posts}
          })).then(() => getUpvoteInfo()).then(upvoteInfo => this.setState({upvoteInfo}))}>
            <FontAwesomeIcon 
              size={"2x"} 
              icon={faCaretDown} 
              style={{color:(this.state.upvoteInfo.downvotes.find(id => id === props.post.id))?"red":"black"}}/>
          </a>
        </div>
      </div>
    </div>
  </div>
}



export default Feed;