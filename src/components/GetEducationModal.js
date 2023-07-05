import React, { useState,useEffect } from "react";
import { toast } from "react-toastify";
import { Button, Form, Header, Input, Modal } from "semantic-ui-react";
import Admin from "../abis/Admin.json";
import Employee from "../abis/Employee.json";
import "./Modals.css";
import ScanQR from "./ScanQR";

const GetEducationModal = (props)=> {
   

  const [institute, setInstitute] = useState("");
  const [startdate, setStartdate] = useState("");
  const [enddate, setEnddate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanQR, setScanQR] = useState(false);

  const handleSubmit = async (e) => {
     if (!institute || !startdate || !enddate || !description) {
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
          .addEducation(institute, startdate, enddate, description)
          .send({
            from: accounts[0],
          });
        toast.success("Education saved successfullyy!!");
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
    setLoading(false);
    props.closeEducationModal();
   };

 

  const closeScanQRModal = () => {
    setScanQR(false);
   };

  const handleAddAddress = (res) => {
    setInstitute(res);
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
            content="Enter Education Details"
            as="h2"
          />
          <Modal.Content className="modal-content">
            <Form className="form-inputs">
              <Form.Field className="form-inputs">
                <Input action>
                  <input
                    id="institute"
                    placeholder="Institute Address"
                    autoComplete="off"
                    autoCorrect="off"
                    value={ institute}
                    onChange={ (e)=> setInstitute(e.target.value)}
                  />
                  <Button
                    type="button"
                    content="QR"
                    icon="qrcode"
                    onClick={() => setScanQR(true)}
                  />
                </Input>
              </Form.Field>
              <Form.Field className="form-inputs">
                <input
                  id="startdate"
                  placeholder="Start Date"
                  autoComplete="off"
                  autoCorrect="off"
                  value={ startdate}
                  onChange={ (e)=> setStartdate(e.target.value)}
                />
              </Form.Field>
              <Form.Field className="form-inputs">
                <input
                  id="enddate"
                  placeholder="End Date"
                  autoComplete="off"
                  autoCorrect="off"
                  value={ enddate}
                  onChange={ (e)=> setEnddate(e.target.value)}
                />
              </Form.Field>
              <Form.Field className="form-inputs">
                <input
                  id="description"
                  placeholder="Degree & Major"
                  autoComplete="off"
                  autoCorrect="off"
                  value={ description}
                  onChange={ (e)=> setDescription(e.target.value)}
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
              loading={ loading}
            />
          </Modal.Actions>
        </Modal>
      </>
    );
 }
export default GetEducationModal;