import React, { Component } from "react";
import axios from "axios";

import PostItem from "../posts/post-item/post-item.component";
import Chat from "../chat/chat.component";
import { connect } from "react-redux";

import { getUserPosts } from "../../redux/post/post.actions";
import { followUser } from "../../redux/user/user.actions";

import InfiniteScroll from "react-infinite-scroll-component";

class Profile extends Component {
  async componentDidMount() {
    let profileId = null;
    if (
      this.props.match !== undefined &&
      this.props.match.path == "/profile/:profileId"
    ) {
      profileId = this.props.match.params.profileId;
    } else {
      profileId = this.props.id;
    }
    this.setState(
      prevState => {
        return {
          ...prevState,
          profileId: profileId
        };
      },
      async function() {
        if (this.state.profileId !== null)
          await this.props.getUserPosts(this.state.profileId);
      }
    );
  }

  setPostsData = (posts, home) => {
    this.setState(
      prevState => {
        return {
          ...prevState,
          posts: home ? posts.data : posts,
          counter: prevState.counter + 1
        };
      },
      () => {
        let isOpen = [];
        this.state.posts.map(post => {
          isOpen.push({ id: post._id, isOpen: false });
        });
        this.setState({ ...this.state, isOpen: isOpen });
      }
    );
  };

  handleClose = id => {
    let isOpen = this.state.isOpen.map(openIndex => {
      return {
        id: openIndex.id,
        isOpen: false
      };
    });
    this.setState({ ...this.state, isOpen });
  };

  loadMore = () => {
    let token = localStorage.getItem("token");
    let offSet = this.state.counter;
    axios
      .get("http://localhost:5000/api/posts/" + offSet, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(posts => {
        if (!posts.data.length) {
          this.setState({ hasMore: false });
        } else {
          this.setState(
            prevState => {
              return {
                ...prevState,
                posts: this.state.posts.concat(posts.data),
                counter: prevState.counter + 10
              };
            },
            () => {
              let isOpen = [];
              this.state.posts.map(post => {
                isOpen.push({ id: post._id, isOpen: false });
              });
              this.setState({ ...this.state, isOpen: isOpen });
            }
          );
        }
      })
      .catch(err => {
        if (err.response.status == 401) {
          localStorage.removeItem("token");
        }
      });
  };

  followUser = userId => {
    this.props.followUser(userId);
  };

  state = {
    posts: [],
    isOpen: [],
    hasMore: false,
    counter: 0,
    chatOpen: false,
    profileId: null
  };

  openChat = () => {
    this.setState(
      prevState => {
        return {
          ...prevState,
          chatOpen: !prevState.chatOpen
        };
      },
      () => {
        console.log(this.state);
      }
    );
  };

  render() {
    let items = [];
    if (this.props.posts !== null && this.props.posts.length > 0) {
      items = this.props.posts.map(post => {
        return <PostItem key={post._id} post={post} />;
      });
    }

    return (
      <>
        <div className="outer-container">
          <div className="container portfolio-page">
            <div className="row">
              <div className="col">
                <ul className="breadcrumbs flex align-items-center">
                  <li>
                    <a href="#">Home</a>
                  </li>
                  <li>Profile</li>
                  {!(this.props.id == this.state.profileId) && (
                    <>
                      <li>
                        <a className="btn btn-primary" onClick={this.openChat}>
                          Send Message
                        </a>
                      </li>
                      {!this.props.following.includes(this.state.profileId) && (
                        <li>
                          <a
                            className="btn btn-primary"
                            onClick={() =>
                              this.followUser(this.state.profileId)
                            }
                          >
                            Follow
                          </a>
                        </li>
                      )}
                      {this.props.following.includes(this.state.profileId) && (
                        <li>
                          <a
                            className="btn btn-success"
                            onClick={() =>
                              this.followUser(this.state.profileId)
                            }
                          >
                            Following
                          </a>
                        </li>
                      )}
                    </>
                  )}
                </ul>
              </div>
            </div>
            <div className="row">
              <InfiniteScroll
                dataLength={items.length}
                next={this.loadMore}
                hasMore={this.state.hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={
                  <p style={{ textAlign: "center" }}>
                    <b>You don't have any more posts.</b>
                  </p>
                }
                style={{
                  display: "flex",
                  flexWrap: "wrap"
                }}
              >
                {items}
              </InfiniteScroll>
            </div>
            {!(this.state.profileId == this.props.id) && (
              <Chat
                newChat={true}
                chatOpen={this.state.chatOpen}
                to={this.state.profileId}
                messages={[]}
                sendMessage={m => this.sendMessage(m)}
              />
            )}
          </div>
        </div>
        <div className="scroll-down flex flex-column justify-content-center align-items-center d-none d-lg-block">
          <span className="arrow-down flex justify-content-center align-items-center">
            <img src="images/arrow-down.png" alt="arrow" />
          </span>
          <span className="scroll-text">Scroll Down</span>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    posts: state.post.posts,
    token: state.user.token,
    id: state.user.id,
    loggedIn: state.user.loggedIn,
    following: state.user.following
  };
};

const mapDispatchToProps = dispatch => ({
  getUserPosts: profileId => dispatch(getUserPosts(profileId)),
  followUser: userId => dispatch(followUser(userId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
