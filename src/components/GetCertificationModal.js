import React, { useState,useEffect } from "react";
import { toast } from "react-toastify";
import { Button, Form, Header, Input, Modal } from "semantic-ui-react";
import Admin from "../abis/Admin.json";
import Employee from "../abis/Employee.json";
import "./Modals.css";
import ScanQR from "./ScanQR";
 
const GetCertificationModal = (props)=> {
 

  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [score, setScore] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanQR, setScanQR] = useState(false);


  const handleSubmit = async (e) => {
     if (!name || !organization || !(score >= 1 && score <= 100)) {
      toast.error("Please enter all the fields.");
      return;
    }
   setLoading(true);
    e.preventDefault();
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    const accounts = await web3.eth.getAccounts();
    if (AdminData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
      const employeeContractAddress = await admin?.methods
        ?.getEmployeeContractByAddress(accounts[0])
        .call();
      const EmployeeContract = await new web3.eth.Contract(
        Employee.abi,
        employeeContractAddress
      );
      try {
        await EmployeeContract.methods
          .addCertification(name, organization, score)
          .send({
            from: accounts[0],
          });
        toast.success("Certification saved successfullyy!!");
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
    setLoading(false);
      props.closeCertificationModal();
  };

  const handleName= (e) => {
    e.preventDefault();
    setName(e.target.value);
  };

  const handleScore= (e) => {
    e.preventDefault();
      setScore(e.target.value);
  };

  const handleOrganization= (e) => {
    e.preventDefault();
    setOrganization(e.target.value);
  };
   

 const  closeScanQRModal = () => {
  setScanQR(false);
   };

  const handleAddAddress = (res) => {
    setOrganization(res);
   };

     return (
      <>
        <ScanQR
          isOpen={  scanQR}
          closeScanQRModal={ closeScanQRModal}
          handleAddAddress={ handleAddAddress}
        />
        <Modal
          as={Form}
          onSubmit={(e) =>  handleSubmit(e)}
          open={ props.isOpen}
          size="tiny"
          className="modal-des"
        >
          <Header
            className="modal-heading"
            icon="pencil"
            content="Enter Certification Details"
            as="h2"
          />
          <Modal.Content className="modal-content">
            <Form className="form-inputs">
              <Form.Field className="form-inputs">
                <input
                  id="name"
                  placeholder="Name"
                  autoComplete="off"
                  autoCorrect="off"
                  value={  name}
                  onChange={ handleName}
                />
              </Form.Field>
              <Form.Field className="form-inputs">
                <Input action>
                  <input
                    id="organization"
                    placeholder="0x0"
                    autoComplete="off"
                    autoCorrect="off"
                    value={  organization}
                    onChange={ handleOrganization}
                  />
                  <Button
                    type="button"
                    content="QR"
                    icon="qrcode"
                    onClick={() =>setScanQR(true)}
                  />
                </Input>
              </Form.Field>
              <Form.Field className="form-inputs">
                <input
                  id="score"
                  placeholder="Score"
                  autoComplete="off"
                  autoCorrect="off"
                  type="number"
                  min="1"
                  max="100"
                  value={  score}
                  onChange={ handleScore}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions className="modal-actions">
            <Button
              className="close-button"
              type="button"
              color="red"
              icon="times"
              content="Close"
              onClick={() =>  props.closeCertificationModal()}
            />
            <Button
              className="button-css"
              type="submit"
              color="green"
              icon="save"
              content="Save"
              loading={  loading}
            />
          </Modal.Actions>
        </Modal>
      </>
    );
  }
 
  export default GetCertificationModal;