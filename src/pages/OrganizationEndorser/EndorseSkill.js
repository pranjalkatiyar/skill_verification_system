import React, { useState, useEffect } from "react";
import { Button, Card, Form, Input, Message } from "semantic-ui-react";
import "./EndorsePage.css";
import Admin from "../../abis/Admin.json";
import Employee from "../../abis/Employee.json";
import Skills from "../../abis/Skills.json";
import { toast } from "react-toastify";
import ScanQR from "../../components/ScanQR";

const EndorseSkill = () => {
  const [employee_address_skill, setEmployee_address_skill] = useState("");
  const [skill_name, setSkill_name] = useState("");
  const [skill_score, setSkill_score] = useState("");
  const [skill_review, setSkill_review] = useState("");
  const [skillError, setSkillError] = useState("");
  const [skillLoading, setSkillLoading] = useState(false);
  const [scanQR, setScanQR] = useState(false);

  const handleEmployeeAddressSkillChange = (e) => {
    setEmployee_address_skill(e.target.value);
  };

  const handleSkillNameChange = (e) => {
    setSkill_name(e.target.value);
  };

  const handleSkillScoreChange = (e) => {
    setSkill_score(e.target.value);
  };

  const handleSkillReviewChange = (e) => {
    setSkill_review(e.target.value);
  };
  
  const handleSkillEndorse = async (e) => {
    e.preventDefault();
    setSkillLoading(true);
    setSkillError("");

    if (
      !employee_address_skill ||
      !skill_name ||
      !(skill_score >= 1 && skill_score <= 100) ||
      !skill_review
    ) {
      toast.error("Please enter all the fields.");
      return;
    }
    e.preventDefault();
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    const SkillData = await Skills.networks[networkId];
    const accounts = await web3.eth.getAccounts();
    if (AdminData && SkillData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
      const skills = await new web3.eth.Contract(Skills.abi, SkillData.address);
      const employeeContractAddress = await admin?.methods
        ?.getEmployeeContractByAddress(employee_address_skill)
        .call();
      const EmployeeContract = await new web3.eth.Contract(
        Employee.abi,
        employeeContractAddress
      );

      try {
        await EmployeeContract.methods
          .endorseSkill(skill_name, skill_score, skill_review)
          .send({
            from: accounts[0],
          });
        await skills?.methods
          ?.addEmployeeToSkill(skill_name, employee_address_skill)
          .send({ from: accounts[0] });
        toast.success("Skill Endorsed successfully!!");
      } catch (err) {
        skillError(err.message);
      }
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
    setSkillLoading(false);
    setSkill_name("");
    setSkill_review("");
    setSkill_score("");
    setEmployee_address_skill("");
  };

  const closeScanQRModal = () => {
    setScanQR(false);
  };

  const handleAddAddress = (res) => {
    setEmployee_address_skill(res);
  };

  return (
    <>
      <ScanQR
        isOpen={scanQR}
        closeScanQRModal={closeScanQRModal}
        handleAddAddress={handleAddAddress}
      />
      <div className="endorse-section">
        <Card className="card-style">
          <Card.Content>
            <Card.Header>
              <h2 className="card-heading">Endorse Skill</h2>
            </Card.Header>
            <br />
            <div>
              <Form
                className="form-inputs"
                onSubmit={handleSkillEndorse}
                error={!!skillError}
              >
                <Form.Field className="form-inputs">
                  <Input action>
                    <input
                      id="employee_address_skill"
                      placeholder="Employee Address"
                      autoComplete="off"
                      autoCorrect="off"
                      value={employee_address_skill}
                      onChange={handleEmployeeAddressSkillChange}
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
                    id="skill_name"
                    placeholder="Skill Name"
                    autoComplete="off"
                    autoCorrect="off"
                    value={skill_name}
                    onChange={handleSkillNameChange}
                  />
                </Form.Field>
                <Form.Field className="form-inputs">
                  <input
                    id="skill_score"
                    placeholder="Skill Level (1-100)"
                    autoComplete="off"
                    autoCorrect="off"
                    type="number"
                    min="1"
                    max="100"
                    value={skill_score}
                    onChange={handleSkillScoreChange}
                  />
                </Form.Field>
                <Form.Field className="form-inputs">
                  <textarea
                    id="skill_review"
                    placeholder="Review"
                    autoComplete="off"
                    autoCorrect="off"
                    value={skill_review}
                    onChange={handleSkillReviewChange}
                  />
                </Form.Field>
                <br />
                <Message error header="Oops!!" content={skillError} />
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
};

export default EndorseSkill;
