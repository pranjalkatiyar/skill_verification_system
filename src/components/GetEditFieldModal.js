import React, { useState,useEffect } from "react";
import { toast } from "react-toastify";
import { Button, Form, Header, Modal } from "semantic-ui-react";
import Admin from "../abis/Admin.json";
import Employee from "../abis/Employee.json";
import "./Modals.css";

const GetEditFieldModal = (props)=> {
 

  const [name1, setName1] = useState("");
  const [description1, setDescription1] = useState("");
  const [location1, setLocation1] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    var name =  name1;
    var description =  description1;
    var location =  location1;
    if (!name) name =  props.name;
    if (!location) location =  props.location;
    if (!description) description =  props.description;
    if (!name || !description || !location) {
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
          .editInfo(name, location, description)
          .send({
            from: accounts[0],
          });
        toast.success("Employee Info Updated");
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
    setLoading(false);
      props.closeEditFieldModal();
  };

 

     return (
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
          content="Update Fields"
          as="h2"
        />
        <Modal.Content className="modal-content">
          <Form className="form-inputs">
            {! props.isDescription && (
              <>
                {" "}
                <Form.Field className="form-inputs">
                  <input
                    id="name1"
                    placeholder="Name"
                    autoComplete="off"
                    autoCorrect="off"
                    value={ name1}
                    onChange={ (e)=>setName1(e.target.value)}
                  />
                </Form.Field>
                <Form.Field className="form-inputs">
                  <input
                    id="location1"
                    placeholder="Location"
                    autoComplete="off"
                    autoCorrect="off"
                    value={ location1}
                    onChange={ (e)=> setLocation1(e.target.value)}
                  />
                </Form.Field>{" "}
              </>
            )}
            { props.isDescription && (
              <Form.Field className="form-inputs">
                <textarea
                  id="description1"
                  placeholder="About"
                  autoComplete="off"
                  autoCorrect="off"
                  value={ description1}
                  onChange={ (e)=> setDescription1(e.target.value)}
                />
              </Form.Field>
            )}
          </Form>
        </Modal.Content>
        <Modal.Actions className="modal-actions">
          <Button
            className="close-button"
            type="button"
            color="red"
            icon="times"
            content="Close"
            onClick={() =>  props.closeEditFieldModal()}
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
    );
 }

export default GetEditFieldModal;
