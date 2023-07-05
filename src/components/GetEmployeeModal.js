import React, { useState,useEffect } from "react";
import { toast } from "react-toastify";
import { Button, Form, Header, Input, Modal } from "semantic-ui-react";
import Admin from "../abis/Admin.json";
import OrgEnd from "../abis/OrganizationEndorser.json";
import "./Modals.css";
import ScanQR from "./ScanQR";

const GetEmployeeModal = (props)=> {
 

  const [employee_address, setEmployee_address] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanQR, setScanQR] = useState(false);


  const handleSubmit = async (e) => {
     if (!employee_address) {
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
      const orgContractAddress = await admin?.methods
        ?.getOrganizationContractByAddress(accounts[0])
        .call();
      const orgContract = await new web3.eth.Contract(
        OrgEnd.abi,
        orgContractAddress
      );
      try {
        await orgContract.methods.addEmployees(employee_address).send({
          from: accounts[0],
        });
        toast.success("Employee Added Successfully!!");
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
    setLoading(false);
      props.closeEmployeeModal();
  };

 

  const closeScanQRModal = () => {
    setScanQR(false);
   };

  const handleAddAddress = (res) => {
    setEmployee_address(res);
    };

     return (
      <>
        <ScanQR
          isOpen={ scanQR}
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
            content="Enter Employee Address"
            as="h2"
          />
          <Modal.Content className="modal-content">
            <Form className="form-inputs">
              <Form.Field className="form-inputs">
                <Input action>
                  <input
                    id="employee_address"
                    placeholder="Employee Address"
                    autoComplete="off"
                    autoCorrect="off"
                    value={ employee_address}
                    onChange={ (e)=>setEmployee_address(e.target.value)}
                  />
                  <Button
                    type="button"
                    content="QR"
                    icon="qrcode"
                    onClick={() =>  setScanQR(true)}
                  />
                </Input>
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
              onClick={() =>  props.closeEmployeeModal()}
            />
            <Button
              className="button-css"
              type="submit"
              color="green"
              icon="save"
              content="Save"
              loading={ loading}
            />
          </Modal.Actions>
        </Modal>
      </>
    );
 }

 export default GetEmployeeModal;