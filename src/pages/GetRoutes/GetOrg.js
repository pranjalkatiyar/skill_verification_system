import React, { useState, useEffect } from "react";
import Organization from "../../abis/OrganizationEndorser.json";
import Admin from "../../abis/Admin.json";
import { toast } from "react-toastify";
import OrgEndCard from "../../components/OrgEndCard";
import EmployeeCard from "../../components/EmployeeCard";
import "./GetOrg.css";
import LoadComp from "../../components/LoadComp";
import { withRouter } from "react-router-dom";
import { set } from "lodash";

const GetOrg = (props) => {
  const [orgContractAddress, setorgcontractAddress] = useState("");
  const [employees, setemployees] = useState([]);
  const [employeeModal, setEmployeeModal] = useState(false);
  const [loadcomp, setloadcomp] = useState(false);

  useEffect(async () => {
    setloadcomp(true);
    await getEmployees();
    setloadcomp(false);
  }, []);

  const getEmployees = async () => {
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    const orgAddress = props.match.params.orgAddress;
    if (!orgAddress) {
      props.history.push("/");
      return;
    }
    if (AdminData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
      const orgContractAddress = await admin?.methods
        ?.getOrganizationContractByAddress(orgAddress)
        .call();
      const orgContract = await new web3.eth.Contract(
        Organization.abi,
        orgContractAddress
      );

      const employeeCount = await orgContract?.methods?.totalEmployees().call();

      const employees = await Promise.all(
        Array(parseInt(employeeCount))
          .fill()
          .map(async (ele, index) => {
            const employee = await orgContract?.methods
              ?.getEmployeeByIndex(index)
              .call();
            return admin.methods.getEmployeeContractByAddress(employee).call();
          })
      );

      setorgcontractAddress(orgContractAddress);
      setemployees(employees);
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
  };
  return loadcomp ? (
    <LoadComp />
  ) : (
    <div>
      {orgContractAddress && (
        <OrgEndCard OrgEndContractAddress={orgContractAddress} />
      )}
      <br />
      <div>
        <div style={{ width: "68%", marginLeft: "auto", marginRight: "auto" }}>
          <h2 className="org-card-heading">Employees in the organization</h2>
        </div>
        <br />
        {employees?.map((employee, index) => (
          <EmployeeCard key={index} employeeContractAddress={employee} />
        ))}
      </div>
      <br />
    </div>
  );
};

export default withRouter(GetOrg);
