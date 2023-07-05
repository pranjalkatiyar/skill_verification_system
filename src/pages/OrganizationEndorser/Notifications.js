import React, { useState,useEffect } from "react";
import { Table, Header, Image, Grid } from "semantic-ui-react";
import ChatBody from "../../components/ChatBody";
import Nochats from "../../components/NoChats";
import "./Organization.css";
import { db } from "../../firebase/firebase";
import Admin from "../../abis/Admin.json";
import { toast } from "react-toastify";

const NotificationsOrg=()=> {
  const colour = ["b6e498", "61dafb", "764abc", "83cd29", "00d1b2"];
   
  const [curr,setCurr]=useState({});
  const [conversations,setConversations]=useState([]);
  const [admin,setAdmin]=useState("");

  useEffect(async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    await db
      .collection("users")
      .doc(accounts[0])
      .collection("activechats")
      .onSnapshot((snapshot) =>
      setConversations(snapshot.docs.map((doc) => doc.data()))
       );
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    if (AdminData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
      const owner = await admin?.methods?.owner().call();
      setAdmin(owner);
     } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
  },[]);

  const genImg = (name) => {
    return `https://ui-avatars.com/api/?background=${
       colour[Math.floor(Math.random() * 5)]
    }&color=fff&name=${name}`;
  };

  const setCurrent = (data) => {
    const curr = {
      ...data,
      avatar:  genImg(data.name),
    };
   setCurr(curr);
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
                      { conversations?.map((data) => {
                        return (
                          <Table.Row
                            className="row-cell-container"
                            onClick={() =>  setCurr(data)}
                            key={data.ethAddress}
                          >
                            <Table.Cell className="header-row-cell">
                              <Header
                                as="h4"
                                image
                                className="notification-sidechat"
                              >
                                <Image
                                  src={ genImg(data.name)}
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
              { curr.ethAddress ? (
                <ChatBody
                  name={ curr.name}
                  ethAddress={ curr.ethAddress}
                  avatar={ curr.avatar}
                  key={ curr.ethAddress}
                  isEndorsementReq={
                     curr.ethAddress !==  admin
                  }
                  org
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
 
  export default NotificationsOrg;