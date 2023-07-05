import React, { useState,useEffect } from "react";
import { toast } from "react-toastify";
import { Button, Form, Header, Modal } from "semantic-ui-react";
import Admin from "../abis/Admin.json";
import Employee from "../abis/Employee.json";
import "./Modals.css";
import { set } from "lodash";

const GetSkillsModal = (props)=> {
  const [name, setName] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);

 const handleSubmit = async (e) => {
     setLoading(true);
  
    if (!name || !experience) {
      toast.error("Please enter all the fields.");
      return;
    }
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
        await EmployeeContract.methods.addSkill(name, experience).send({
          from: accounts[0],
        });
        toast.success("Skill saved successfully!!");
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
    setLoading(false);
      props.closeCertificationModal();
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
          content="Enter Skill Details"
          as="h2"
        />
        <Modal.Content className="modal-content">
          <Form className="form-inputs">
            <Form.Field className="form-inputs">
              <input
                id="name"
                placeholder="Skill Name"
                autoComplete="off"
                autoCorrect="off"
                value={ name}
                onChange={ (e)=>setName(e.target.value)}
              />
            </Form.Field>
            <Form.Field className="form-inputs">
              <input
                id="experience"
                placeholder="Experience"
                autoComplete="off"
                autoCorrect="off"
                value={ experience}
                onChange={ (e)=>setExperience(e.target.value)}
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
    );
 }


 export default GetSkillsModal;
