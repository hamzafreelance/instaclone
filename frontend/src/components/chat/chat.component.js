import React, { useState, useEffect } from "react";
import "./chat.styles.css";
import { set } from "mongoose";
import axios from "axios";
import socketIOClient from "socket.io-client";
import { connect } from 'react-redux';

const Chat = ({ to, sendMessage, chatOpen, newChat , token}) => {
  const [isOpen, setIsOpen] = useState(chatOpen);
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [messagesEnd, setMessagesEnd] = useState(null);

  const [toUser, setToUser] = useState(null);

  const socket = socketIOClient("http://localhost:5000");
  socket.on("receive-message", data => {
    if(token == undefined)
      return false;
    axios
      .get("http://localhost:5000/api/chat/" + to, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(messages => {
        if (messages.data.messages.length > 0) {
          console.log("new message received");
          setMessages(messages.data.messages);
        }
      });
  });

  socket.on("user-typing", data => {
    if (data) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  });

  sendMessage = (message, chatId) => {
    if(token == undefined)
      return false;
    axios
      .post(
        "http://localhost:5000/api/chat/sendMessage/" + profileId,
        { message },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      .then(res => {
        socket.emit("send-message", { message, chatId });
      });
  };

  const toggleWindow = () => {
    if(token == undefined)
      return false;
    setIsOpen(!isOpen);
    axios
      .get("http://localhost:5000/api/chat/" + to, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(messages => {
        if (messages.data.messages.length > 0) {
          setChatId(messages.data.messages[0].chat);
          setProfileId(messages.data.messages[0].user);
          setMessages(messages.data.messages);
          setTimeout(function() {
            if (messagesEnd !== null || messagesEnd != undefined)
              messagesEnd.scrollIntoView({ behavior: "smooth" });
          }, 2000);
        }
      });
  };

  const getUser = (to) => {
    if(token == undefined)
      return false;
    axios
      .get("http://localhost:5000/api/users/get/" + to, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        console.log('to user data');
        console.log(res.data);
        setToUser(res.data.user);
      });
  };

  useEffect(() => {
    setIsOpen(chatOpen);
    if(to !== null)
      getUser(to);
  }, [messages, chatOpen, to]);

  const keyPress = e => {
    if (e.keyCode == 13) {
      sendMessage(e.target.value, chatId);
      socket.emit("is-typing", false);
    } else {
      socket.emit("is-typing", true);
    }
  };

  const keyUp = e => {
    if (e.target.value == "") {
      socket.emit("is-typing", false);
    }
  };

  return (
    <>
      <div className="container">
        <div
          className="row chat-window col-xs-5 col-md-3"
          id="chat_window_1"
          style={{ marginLeft: "10px", right: "10px" }}
        >
          <div className="col-xs-12 col-md-12">
            <div className="panel panel-default">
              <div
                className="panel-heading top-bar"
                style={{
                  fontSize: "14px",
                  backgroundColor: "#ffffff",
                  height: "60px"
                }}
              >
                <div className="col-md-8 col-xs-8">
                  <h3 className="panel-title" onClick={toggleWindow}>
                    <span className="glyphicon glyphicon-comment"></span> Chat -
                    Miguel
                  </h3>
                </div>
                <div
                  className="col-md-4 col-xs-4"
                  style={{ textAlign: "right" }}
                >
                  <a href="#">
                    <span
                      id="minim_chat_window"
                      className="glyphicon glyphicon-minus icon_minim"
                    ></span>
                  </a>
                  <a href="#">
                    <span
                      className="glyphicon glyphicon-remove icon_close"
                      data-id="chat_window_1"
                    ></span>
                  </a>
                </div>
              </div>
              <div
                className={
                  "panel-body msg_container_base" + (isOpen ? "" : " hidden")
                }
              >
                {messages != undefined && messages.length > 0 ? (
                  messages.map((message, index) => {
                    return index + 1 == messages.length ? (
                      <div
                        className={
                          message.from == localStorage.getItem("id")
                            ? " row msg_container base_sent"
                            : " row msg_container base_receive"
                        }
                        key={message._id}
                        ref={el => {
                          setMessagesEnd(el);
                        }}
                      >
                        <div className="col-md-10 col-xs-10">
                          <div
                            className={
                              message.from == localStorage.getItem("id")
                                ? "messages msg_sent"
                                : "messages msg_receive"
                            }
                          >
                            <p>{message.message}</p>
                            <time>{message.created_at}</time>
                          </div>
                        </div>
                        <div className="col-md-2 col-xs-2 avatar">
                          <img
                            src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg"
                            className=" img-responsive "
                          />
                        </div>
                      </div>
                    ) : (
                      <div
                        className={
                          message.from == localStorage.getItem("id")
                            ? " row msg_container base_sent"
                            : " row msg_container base_receive"
                        }
                        key={message._id}
                      >
                        <div className="col-md-10 col-xs-10">
                          <div
                            className={
                              message.from == localStorage.getItem("id")
                                ? " messages msg_sent"
                                : " messages msg_receive"
                            }
                          >
                            <p>{message.message}</p>
                            <time>{message.created_at}</time>
                          </div>
                        </div>
                        <div className="col-md-2 col-xs-2 avatar">
                          <img
                            src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg"
                            className=" img-responsive "
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>Enter message to start chatting.</p>
                )}
                {isTyping && <span>typing....</span>}
              </div>
              <div className={"panel-footer" + (isOpen ? "" : " hidden")}>
                <div className="input-group">
                  <input
                    id="message"
                    type="text"
                    onKeyDown={keyPress}
                    onKeyUp={keyUp}
                    className="form-control input-sm chat_input"
                    placeholder="Write your message here..."
                  />
                  <span className="input-group-btn">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={sendMessage}
                    >
                      Send
                    </button>
                  </span>
                </div>
              </div>
              <div className={"panel-footer" + (!isOpen ? "" : " hidden")}>
                <div
                  className="panel-heading"
                  style={{
                    fontSize: "14px",
                    backgroundColor: "#000000",
                    height: "60px"
                  }}
                >
                  <div className="col-md-8 col-xs-8">
                    <h3 className="panel-title" onClick={toggleWindow}>
                      <span className="glyphicon glyphicon-comment"></span>{" "}
                      { (toUser !== null) && toUser.name }
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="btn-group dropup">
          <button
            type="button"
            className="btn btn-default dropdown-toggle"
            data-toggle="dropdown"
          >
            <span className="glyphicon glyphicon-cog"></span>
            <span className="sr-only">Toggle Dropdown</span>
          </button>
          <ul className="dropdown-menu" role="menu">
            <li>
              <a href="#" id="new_chat">
                <span className="glyphicon glyphicon-plus"></span> Novo
              </a>
            </li>
            <li>
              <a href="#">
                <span className="glyphicon glyphicon-list"></span> Ver outras
              </a>
            </li>
            <li>
              <a href="#">
                <span className="glyphicon glyphicon-remove"></span> Fechar Tudo
              </a>
            </li>
            <li className="divider"></li>
            <li>
              <a href="#">
                <span className="glyphicon glyphicon-eye-close"></span>{" "}
                Invisivel
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  token: state.user.token
});

export default connect(mapStateToProps)(Chat);
