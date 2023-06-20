import React, { useState,useEffect } from "react";
import {
  Button,
  Card,
  Dropdown,
  Form,
  Input,
  Message,
} from "semantic-ui-react";
import "./EndorsePage.css";
import Admin from "../../abis/Admin.json";
import Employee from "../../abis/Employee.json";
import { toast } from "react-toastify";
import ScanQR from "../../components/ScanQR";

const Endorse=()=>{
    const[employee_address,setEmployeeAddresss]=useState("");
    const[section,setSections]=useState("");
    const[skillLoading,setSkillLoadings]=useState(false);
    const[certification_name,setCertificationNames]=useState("");
    const[scanQR,setScanQRs]=useState(false)
    const[skillError,setSkillErrors]=useState("");
 
  const handleEmployeeAddress = (e) => {
    e.preventDefault();
    setEmployeeAddresss(e.target.value);
  };

  const handleCertificationName = (e) => {
    e.preventDefault();
    setCertificationNames(e.target.value);
  };
  
  const handleSkillEndorse = async (e) => {
    e.preventDefault();
    setSkillLoadings(true);
    setSkillErrors("");
    
    if (!employee_address || !section) {
      toast.error("Please enter all the fields.");
      return;
    }
    if (section === "3" && !certification_name) {
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
        ?.getEmployeeContractByAddress(employee_address)
        .call();
      const EmployeeContract = await new web3.eth.Contract(
        Employee.abi,
        employeeContractAddress
      );
      // console.log(employeeContractAddress, EmployeeContract);
      try {
        if (section === 1) {
          await EmployeeContract?.methods
            ?.endorseEducation()
            .send({ from: accounts[0] });
        } else if (section === 2) {
          await EmployeeContract?.methods
            ?.endorseWorkExp()
            .send({ from: accounts[0] });
        } else {
          console.log(certification_name);
          await EmployeeContract?.methods
            ?.endorseCertification(certification_name)
            .send({ from: accounts[0] });
        }
        toast.success("Endorsed successfully!!");
      } catch (err) {
        setSkillErrors(err.message);
        // this.setState({ skillError: err.message });
      }
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
    setSkillLoadings(false);
    setSections("");
    setEmployeeAddresss("");
  };

  const closeScanQRModal = () => {
    setScanQRs(false);
  };

  const handleAddAddress = (res) => {
    setEmployeeAddresss(res);
    };

  const roleOptions = [
    {
      key: "0",
      text: "No-Role-Selected",
      value: "0",
    },
    {
      key: "1",
      text: "Endorse Education",
      value: "1",
    },
    {
      key: "2",
      text: "Endorse Work Experience",
      value: "2",
    },
    {
      key: "3",
      text: "Endorse Certification",
      value: "3",
    },
  ];

  const handleDropdownSelect = (e, data) => {
   setSections(data.value);
  };

     return (
      <>
        <ScanQR
          isOpen={ scanQR}
          closeScanQRModal={this.closeScanQRModal}
          handleAddAddress={this.handleAddAddress}
        />
        <div className="endorse-section">
          <Card className="card-style">
            <Card.Content>
              <Card.Header>
                <h2 className="card-heading">Endorse Section</h2>
              </Card.Header>
              <br />
              <div>
                <Form
                  className="form-inputs"
                  onSubmit={this.handleSkillEndorse}
                  error={!! skillError}
                >
                  <Form.Field className="form-inputs">
                    <Input action>
                      <input
                        id="employee_address"
                        placeholder="Employee Address"
                        autoComplete="off"
                        autoCorrect="off"
                        value={ employee_address}
                        onChange={ handleEmployeeAddress}
                      />
                      <Button
                        type="button"
                        content="QR"
                        icon="qrcode"
                        onClick={() => setScanQRs(true)}
                      />
                    </Input>
                  </Form.Field>
                  <Form.Field className="form-inputs">
                    <Dropdown
                      placeholder="Select Role"
                      fluid
                      selection
                      options={ roleOptions}
                      onChange={ handleDropdownSelect}
                    />
                  </Form.Field>
                  {section === "3" && (
                    <Form.Field className="form-inputs">
                      <input
                        id="certification_name"
                        placeholder="Certification Name"
                        autoComplete="off"
                        autoCorrect="off"
                        value={certification_name}
                        onChange={handleCertificationName}
                      />
                    </Form.Field>
                  )}
                  <br />
                  <Message
                    error
                    header="Oops!!"
                    content={skillError}
                  />
                  <br />
                  <Button
                    className="button-css"
                    type="submit"
                    icon="save"
                    content="Endorse"
                    floated="right"
                    loading={skillLoading}
                  />
                </Form>
              </div>
            </Card.Content>
          </Card>
        </div>
      </>
    );
 }

 export default Endorse;