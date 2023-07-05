import React, { useState,useEffect } from "react";
import { Button, Header, Modal, Table } from "semantic-ui-react";
import "./Modals.css";
import Admin from "../abis/Admin.json";
import Employee from "../abis/Employee.json";
import { toast } from "react-toastify";
import { withRouter } from "react-router-dom";
import { set } from "lodash";

const GetInfoModal = (props)=> {
 
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const createUser = async (e) => {
    e.preventDefault();
    const { ethAddress, name, location, role, description } =  props.info;
    if (!name || !location || !description || !role || !ethAddress) {
      toast.error("Please fill all the fields!!");
      return;
    }
    setLoading(true);
    setErrorMessage("")

     const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    if (AdminData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);

      const owner = await admin.methods.owner().call();
      if (owner !== accounts[0]) {
        setErrorMessage("Sorry! You are not the Admin!!");
        setLoading(false);
        return;
      }
      try {
        await admin.methods
          .registerUser(ethAddress, name, location, description, role)
          .send({ from: accounts[0] });
        toast.success("New user registered succressfully!!!!");
         props.history.push(
          `${role === "1" ? "/" : "/all-organization-endorser"}`
        );
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
     }
  };

 const endorseEmployee = async (info) => {
    const { req } = info;
    var section = -1;
    if (req === "Education Endorsement Request") section = 1;
    else if (req === "Certification Endorsement Request") section = 2;
    else if (req === "Work Experience Endorsement Request") section = 3;
    setLoading(true);
    setErrorMessage("");
      const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    if (AdminData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
      try {
        const employeeContractAddress = await admin.methods
          .getEmployeeContractByAddress( props.info?.ethAddress)
          .call();
        const EmployeeContract = await new web3.eth.Contract(
          Employee.abi,
          employeeContractAddress
        );
        if (section === 1) {
          await EmployeeContract.methods
            ?.endorseEducation()
            .send({ from: accounts[0] });
        } else if (section === 2) {
          await EmployeeContract?.methods
            ?.endorseCertification(info.name)
            .send({ from: accounts[0] });
        } else if (section === 3) {
          await EmployeeContract?.methods
            ?.endorseWorkExp()
            .send({ from: accounts[0] });
        }
        toast.success("New user registered succressfully!!!!");
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
     }
     props.closeInfoModal();
  };

     return (
      <>
        { props.isEndorsementReq ? (
          <Modal open={ props.isOpen} size="tiny" className="modal-des">
            <Header
              className="modal-heading"
              icon="pencil"
              content={ props.info?.req}
              as="h2"
            />
            <Modal.Content className="modal-content">
              <Table className="design-info-table">
                <Table.Row>
                  <Table.HeaderCell>Fields</Table.HeaderCell>
                  <Table.HeaderCell>Values Provided</Table.HeaderCell>
                </Table.Row>
                <hr style={{ border: "none", borderTop: "1px solid white" }} />
                { props.info?.req === "Education Endorsement Request" && (
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>
                        <p style={{ fontWeight: "700" }}>Institute</p>
                      </Table.Cell>
                      <Table.Cell>
                        <p>{ props.info?.institute}</p>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <p style={{ fontWeight: "700" }}>Description</p>
                      </Table.Cell>
                      <Table.Cell>
                        <p>{ props.info?.description}</p>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <p style={{ fontWeight: "700" }}>Start date</p>
                      </Table.Cell>
                      <Table.Cell>
                        <p>{ props.info?.startdate}</p>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <p style={{ fontWeight: "700" }}>End date</p>
                      </Table.Cell>
                      <Table.Cell>
                        <p>{ props.info?.enddate}</p>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                )}
                { props.info?.req ===
                  "Certification Endorsement Request" && (
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>
                        <p style={{ fontWeight: "700" }}>Name</p>
                      </Table.Cell>
                      <Table.Cell>
                        <p>{ props.info?.name}</p>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <p style={{ fontWeight: "700" }}>Organization</p>
                      </Table.Cell>
                      <Table.Cell>
                        <p>{ props.info?.organization}</p>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <p style={{ fontWeight: "700" }}>Score</p>
                      </Table.Cell>
                      <Table.Cell>
                        <p>{ props.info?.score}</p>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                )}
                { props.info?.req ===
                  "Work Experience Endorsement Request" && (
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>
                        <p style={{ fontWeight: "700" }}>Role</p>
                      </Table.Cell>
                      <Table.Cell>
                        <p>{ props.info?.role}</p>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <p style={{ fontWeight: "700" }}>Organization</p>
                      </Table.Cell>
                      <Table.Cell>
                        <p>{ props.info?.organization}</p>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <p style={{ fontWeight: "700" }}>Description</p>
                      </Table.Cell>
                      <Table.Cell>
                        <p>{ props.info?.description}</p>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <p style={{ fontWeight: "700" }}>Start Date</p>
                      </Table.Cell>
                      <Table.Cell>
                        <p>{ props.info?.startdate}</p>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>
                        <p style={{ fontWeight: "700" }}>Enddate</p>
                      </Table.Cell>
                      <Table.Cell>
                        <p>{ props.info?.enddate}</p>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                )}
              </Table>
            </Modal.Content>
            <Modal.Actions className="modal-actions">
              <Button
                className="close-button"
                type="button"
                color="red"
                icon="times"
                content="Close"
                onClick={() =>  props.closeInfoModal()}
              />
              { props.org && (
                <Button
                  className="button-css"
                  type="submit"
                  color="green"
                  icon="save"
                  content="Endorse"
                  loading={ loading}
                  onClick={() =>  endorseEmployee( props.info)}
                />
              )}
            </Modal.Actions>
          </Modal>
        ) : (
          <Modal open={ props.isOpen} size="tiny" className="modal-des">
            <Header
              className="modal-heading"
              icon="pencil"
              content="Info Provided to Admins"
              as="h2"
            />
            <Modal.Content className="modal-content">
              <Table className="design-info-table">
                <Table.Row>
                  <Table.HeaderCell>Fields</Table.HeaderCell>
                  <Table.HeaderCell>Values Provided</Table.HeaderCell>
                </Table.Row>
                <hr style={{ border: "none", borderTop: "1px solid white" }} />
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>
                      <p style={{ fontWeight: "700" }}>Name</p>
                    </Table.Cell>
                    <Table.Cell>
                      <p>{ props.info?.name}</p>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      <p style={{ fontWeight: "700" }}>Eth Address</p>
                    </Table.Cell>
                    <Table.Cell>
                      <p>{ props.info?.ethAddress}</p>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      <p style={{ fontWeight: "700" }}>Location</p>
                    </Table.Cell>
                    <Table.Cell>
                      <p>{ props.info?.location}</p>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      <p style={{ fontWeight: "700" }}>Description</p>
                    </Table.Cell>
                    <Table.Cell>
                      <p>{ props.info?.description}</p>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>
                      <p style={{ fontWeight: "700" }}>Role Requested</p>
                    </Table.Cell>
                    <Table.Cell>
                      <p>
                        { props.info?.role === "1"
                          ? "Employee"
                          : "Organization Endorser"}
                      </p>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Modal.Content>
            <Modal.Actions className="modal-actions">
              <Button
                className="close-button"
                type="button"
                color="red"
                icon="times"
                content="Close"
                onClick={() =>  props.closeInfoModal()}
              />
              { props.admin && (
                <Button
                  className="button-css"
                  type="submit"
                  color="green"
                  icon="save"
                  content="Register User"
                  loading={ loading}
                  onClick={ createUser}
                />
              )}
            </Modal.Actions>
          </Modal>
        )}{" "}
      </>
    );
 }

export default withRouter(GetInfoModal);
