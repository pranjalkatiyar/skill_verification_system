import React, { Component, useEffect ,useState} from "react";
import QRCode from "qrcode";
import "./Modals.css";
import { Button, Header, Modal } from "semantic-ui-react";

const GenererateQR =(props)=> {
  
  const [qr, setQr] = useState("");

  useEffect(async()=>{
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    try {
      const res = await QRCode.toDataURL(accounts[0]);
       setQr(res);
    } catch (err) {
      console.log(err);
    }
  },[])

     return (
      <Modal size="tiny" className="modal-des" open={props.isOpen}>
        <Header
          className="modal-heading"
          icon="qrcode"
          content="Scan or Download"
          as="h2"
        />
        <Modal.Content className="modal-content pos-middle-qr">
          <a href={qr} download>
            <img src={qr} alt="qr"></img>
          </a>
        </Modal.Content>
        <Modal.Actions className="modal-actions">
          <Button
            className="close-button"
            type="button"
            color="red"
            icon="times"
            content="Close"
            onClick={() => props.closeQRModal()}
          />
        </Modal.Actions>
      </Modal>
    );
}

export default GenererateQR;