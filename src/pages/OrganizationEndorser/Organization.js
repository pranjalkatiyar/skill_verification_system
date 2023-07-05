import React, { useState,useEffect } from "react";
import Organization from "../../abis/OrganizationEndorser.json";
import Admin from "../../abis/Admin.json";
import { toast } from "react-toastify";
import OrgEndCard from "../../components/OrgEndCard";
import EmployeeCard from "../../components/EmployeeCard";
import "./Organization.css";
import GetEmployeeModal from "../../components/GetEmployeeModal";
import LoadComp from "../../components/LoadComp";

const OrganizationEndorser=()=> {

  const [orgContractAddress,setOrgcontractAddress]=useState("");
  const [employees,setEmployees]=useState([]);
  const [employeemodal,setEmployeemodal]=useState(false);
  const [loadcomp,setLoadcomp]=useState(false);

  useEffect(async () => {
    setLoadcomp(true);
    await getEmployees();
    setLoadcomp(false);
  },[]);

  const getEmployees = async () => {
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
      // console.log("emp", employees);
      setOrgcontractAddress(orgContractAddress);
      setEmployees(employees);
     } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
  };

  const closeEmployeeModal = () => {
    setEmployeemodal(false);
    getEmployees();
   };

     return loadcomp ? ( 
      <LoadComp />
    ) : (
      <div>
        <GetEmployeeModal
          isOpen={ employeemodal}
          closeEmployeeModal={ closeEmployeeModal}
        />
        { orgContractAddress && (
          <OrgEndCard OrgEndContractAddress={ orgContractAddress} />
        )}
        <br />
        <div>
          <div
            style={{ width: "68%", marginLeft: "auto", marginRight: "auto" }}
          >
            <span
              className="add-employee"
              onClick={(e) =>setEmployeemodal(! employeemodal)}
             >
              <span class="fas fa-plus">&nbsp;Add Employee</span>
            </span>
            <h2 className="org-card-heading">Employees in the organization</h2>
          </div>
          <br />
          { employees?.map((employee, index) => (
            <EmployeeCard key={index} employeeContractAddress={employee} />
          ))}
        </div>
        <br />
      </div>
    );
  }

export default OrganizationEndorser;