import React, { Component, ComponentType, StatelessComponent } from 'react';
import './Feed.css'
import {IPost, IUpvoteInfo} from '../objects'
import InfiniteScroll  from 'react-infinite-scroll-component';
import { getPosts, getUpvoteInfo, upvote, downvote } from '../api/feed';
import LazyLoad from 'react-lazyload';
import { Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
interface IState {
    posts : IPost[],
    upvoteInfo: IUpvoteInfo,
    hasMore: boolean,
    page : number,
    pageSize : number
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
      hasMore: true
    }
  }
  
  next(){
    getPosts(this.state.page,this.state.pageSize).then(([newPosts,hasMore]) => {
      const newLength = this.state.posts.length + newPosts.length
      this.setState(({posts,page}) => ({posts:[...posts,...newPosts],hasMore,page:page+1}))
      if(newLength*this.height < window.innerHeight && hasMore){
        this.next()
      }
    },
    (error) => {
      
    })
  }
    
  componentDidMount() {
    this.next()
    getUpvoteInfo().then(upvoteInfo => this.setState({upvoteInfo}))
  }
  
  

  render() {
    return (
    
      <InfiniteScrollFix
        dataLength={this.state.posts.length}
        hasMore={this.state.hasMore}
        next={this.next}
        loader={<h4>Loading...</h4>}
        style={{width:"100%"}}
        className={"container"}
        endMessage={<h4>All done.</h4>}
      >
        {this.state.posts.map(post => <Row key={post.id}>
        <Col xs="12" lg={{size:"6",offset:"3"}}>
          <this.Post post={post}/>
        </Col>
        </Row>)}
      </InfiniteScrollFix>
    );
  }
  Post : StatelessComponent<{post:IPost}> = (props) => 
  <div className="post">
    <div className="postInner">
      <LazyLoad offset={this.height*2}>
        <img className="col-12" src={`/images/${props.post.pictureID}.jpeg`}/>
      </LazyLoad>
      <div>
        {props.post.tags.map(tag => <a key={tag} href="#" className="tag">#{tag}</a>)}
        <div className="vote">
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