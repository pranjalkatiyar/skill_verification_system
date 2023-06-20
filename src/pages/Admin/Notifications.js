import React, { Component,useEffect,useState } from "react";
import { Table, Header, Image, Grid } from "semantic-ui-react";
import ChatBody from "../../components/ChatBody";
import Nochats from "../../components/NoChats";
import "./Admin.css";
import { db } from "../../firebase/firebase";

const NotificationsAdmin =()=> {
  const colour = ["b6e498", "61dafb", "764abc", "83cd29", "00d1b2"];
  // state = {
  //   curr: {},
  //   conversations: [],
  // };
  const [curr, setCurr] = useState({});
  const [conversations, setConversations] = useState([]);

  useEffect(async()=>{
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    await db
      .collection("users")
      .doc(accounts[0])
      .collection("activechats")
      .onSnapshot((snapshot) =>
        setConversations(snapshot.docs.map((doc) => doc.data()))
      );
    console.log(conversations);
  },[]);


  // componentDidMount = async () => {
  //   const web3 = window.web3;
  //   const accounts = await web3.eth.getAccounts();
  //   await db
  //     .collection("users")
  //     .doc(accounts[0])
  //     .collection("activechats")
  //     .onSnapshot((snapshot) =>
  //       this.setState({ conversations: snapshot.docs.map((doc) => doc.data()) })
  //     );
  //   console.log(this.state.conversations);
  // };

  const genImg = (name) => {
    return `https://ui-avatars.com/api/?background=${
      colour[Math.floor(Math.random() * 5)]
    }&color=fff&name=${name}`;
  };

  const setCurrent = (data) => {
    const curr = {
      ...data,
      avatar: genImg(data.name),
    };
    setCurr(curr);
    // this.setState({ curr });
  };

     return (
      <div className="notifications">
        <Grid style={{ height: "100%", width: "100%" }}>
          <Grid.Row>
            <Grid.Column width={6} style={{ borderRight: "1px solid #c5c6c7" }}>
              <div className="sidechat-container">
                <Table basic="very" celled collapsing>
                  <Table.Header>
                    <Table.Row className="header-row">
                      <Table.HeaderCell className="notification-sidechat">
                        Coversations
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <div
                    style={{
                      maxHeight: "70vh",
                      overflow: "auto",
                      overflowX: "clip",
                      paddingRight: "7px",
                    }}
                  >
                    <Table.Body className="sidechat-body">
                      {conversations?.map((data) => {
                        return (
                          <Table.Row
                            className="row-cell-container"
                            onClick={() => setCurrent(data)}
                            key={data.ethAddress}
                          >
                            <Table.Cell className="header-row-cell">
                              <Header
                                as="h4"
                                image
                                className="notification-sidechat"
                              >
                                <Image
                                  src={genImg(data.name)}
                                  rounded
                                  size="mini"
                                />
                                <Header.Content>
                                  {data.name}
                                  <Header.Subheader className="notification-sidechat-subheading">
                                    <small
                                      style={{
                                        wordBreak: "break-word",
                                        fontSize: "11px",
                                      }}
                                    >
                                      <em>{data.ethAddress}</em>
                                    </small>
                                  </Header.Subheader>
                                </Header.Content>
                              </Header>
                            </Table.Cell>
                          </Table.Row>
                        );
                      })}
                    </Table.Body>
                  </div>
                </Table>
              </div>
            </Grid.Column>
            <Grid.Column width={10}>
              {curr.ethAddress ? (
                <ChatBody
                  name={curr.name}
                  ethAddress={curr.ethAddress}
                  avatar={curr.avatar}
                  key={curr.ethAddress}
                  admin
                />
              ) : (
                <Nochats />
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  
}

export default NotificationsAdmin;