import React, { Component, useEffect, useState } from "react";
import { Image, Input, Loader } from "semantic-ui-react";
import "./ChatBody.css";
import { db } from "../firebase/firebase";
import GetInfoModal from "./GetInfoModal";

const senderDesign = {
  position: "relative",
  fontSize: "1rem",
  padding: "10px",
  backgroundColor: "#c5c6c7",
  color: "black",
  borderRadius: "10px",
  width: "fit-content",
  marginBottom: "23px",
  maxWidth: "60%",
  boxShadow: "inset 0 0 3px black",
};

const receiverDesign = {
  position: "relative",
  fontSize: "1rem",
  padding: "10px",
  backgroundColor: "rgba(0, 128, 128,.4)",
  borderRadius: "10px",
  width: "fit-content",
  marginBottom: "23px",
  marginLeft: "auto",
  color: "white",
  maxWidth: "60%",
  boxShadow: "inset 0 0 3px lightgray",
};

const ChatBody = (props) => {
  // state = {
  //   chats: [],
  //   loading: false,
  //   message: "",
  //   account: "",
  //   infomaodal: false,
  // };
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [account, setAccount] = useState("");
  const [infomaodal, setInfomaodal] = useState(false);

  useEffect(async () => {
    setLoading(true);
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    var key;
    const ethAddress = props.ethAddress;
    if (ethAddress < accounts[0]) {
      key = ethAddress + "#" + accounts[0];
    } else {
      key = accounts[0] + "#" + ethAddress;
    }
    await db
      .collection("chats")
      .doc(key)
      .collection("chatmessages")
      .orderBy("timeStamp", "desc")
      .onSnapshot((snapshot) =>
        setChats(snapshot.docs.map((doc) => doc.data()))
      );
    // this.setState({ chats: snapshot.docs.map((doc) => doc.data()) })
    // );
    // console.log(this.state.chats);
    console.log(chats);
    setLoading(false);
    // this.setState({ loading: false });
  },[]);

  // componentDidMount = async () => {
  //   // this.setState({ loading: true });
  //   setLoading(true);

  //   // this.setState({ account: accounts[0] });

  // };

  const sendMessage = async (e) => {
    e.preventDefault();
    console.log(account);
    const accounts = account;
    const ethAddress = props.ethAddress;
    var key;
    if (ethAddress < accounts) {
      key = ethAddress + "#" + accounts;
    } else {
      key = accounts + "#" + ethAddress;
    }
    await db.collection("chats").doc(key).collection("chatmessages").add({
      message: message,
      sender: accounts,
      receiver: ethAddress,
      timeStamp: new Date(),
    });
    // this.setState({ message: "" });
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage(e);
  };

  const closeInfoModal = async () => {
    setInfomaodal(false);
    // this.setState({ infomaodal: false });
  };

  return loading ? (
    <Loader active />
  ) : (
    <>
      <GetInfoModal
        isOpen={infomaodal}
        closeInfoModal={closeInfoModal}
        info={chats && chats.length >= 1 ? chats[chats.length - 1].info : {}}
        admin={props.admin}
        isEndorsementReq={props.isEndorsementReq}
        org={props.org}
      />
      <div style={{ marginTop: "7px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
          onClick={() => setInfomaodal(true)}
        >
          <div>
            <Image src={props.avatar} avatar style={{ fontSize: "25px" }} />
            <span
              style={{
                matginLeft: "10px",
                fontSize: "20px",
                fontWeight: "600",
              }}
            >
              {props.name}
            </span>
          </div>
          <small
            style={{
              fontWeight: "600",
              wordBreak: "break-word",
              fontSize: "0.7rem",
              marginTop: "30px",
            }}
          >
            {props.ethAddress}
          </small>
        </div>
        <hr></hr>
        <div
          style={{
            display: "flex",
            flexDirection: "column-reverse",
            overflow: "auto",
            paddingLeft: "4px",
            paddingRight: "4px",
            paddingTop: "10px",
            height: "61vh",
          }}
        >
          {chats?.map((chat, index) => {
            return (
              <p
                key={index}
                style={account !== chat.sender ? senderDesign : receiverDesign}
              >
                {chat.sender !== "none" && (
                  <>
                    <small>
                      <b
                        style={{
                          color:
                            account !== chat.sender ? "black" : "lightgray",
                          fontSize: "10px",
                          float: "left",
                          marginBottom: "3px",
                          wordBreak: "break-word",
                        }}
                      >
                        {chat.sender}
                      </b>
                    </small>
                    <br></br>
                  </>
                )}
                <span style={{ float: "left" }}>{chat.message}</span>
                <br></br>
                <small
                  style={{
                    float: "right",
                    color: account !== chat.sender ? "black" : "lightgray",
                    fontSize: "10px",
                  }}
                >
                  {new Date(chat.timeStamp?.toDate()).toUTCString()}
                </small>
              </p>
            );
          })}
        </div>
      </div>
      <div
        style={{
          height: "50px",

          minWidth: "3rem",
        }}
      >
        <Input
          value={message}
          action={{
            color: "rgba(31, 30, 30, 0.581)",
            labelPosition: "right",
            icon: "send",
            content: "Send",
            onClick: (e) => sendMessage(e),
          }}
          onChange={(e) => setMessage(e.target.value)}
          style={{
            width: "100%",
          }}
          placeholder="Enter text..."
          className="design-chat-input"
          onKeyPress={handleKeyPress}
        />
      </div>
    </>
  );
};

export default ChatBody;
