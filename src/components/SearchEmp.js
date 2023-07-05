import React, { useState, useEffect } from "react";
import Employee from "../abis/Employee.json";
import Admin from "../abis/Admin.json";
import { toast } from "react-toastify";
import { Dimmer, Loader } from "semantic-ui-react";
import { withRouter } from "react-router-dom";

const SearchEmp = (props)=> {
 
  const [employeedata, setEmployeedata] = useState({});
  const [loading, setLoading] = useState(false);
  const [employeeContractAddress, setEmployeeContractAddress] = useState("");

  useEffect(async () => {
    setLoading(true);
     const empAddress =  props.emp;
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    if (AdminData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
      const employeeContractAddress = await admin.methods
        ?.getEmployeeContractByAddress(empAddress)
        .call();
      const EmployeeContract = await new web3.eth.Contract(
        Employee.abi,
        employeeContractAddress
      );
      const employeedata = await EmployeeContract.methods
        .getEmployeeInfo()
        .call();
      const newEmployedata = {
        ethAddress: employeedata[0],
        name: employeedata[1],
        location: employeedata[2],
        description: employeedata[3],
        overallEndorsement: employeedata[4],
        endorsecount: employeedata[5],
      };
      setEmployeedata(newEmployedata);
      setEmployeeContractAddress(employeeContractAddress);
     } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
    setLoading(false);
   },[]);

  const toRoute = () => {
     props.history.push(
      `/getemployee/${ employeeContractAddress}`
    );
    window.location.reload(false);
  };

     return  loading ? (
      <Dimmer active={ loading} inverted>
        <Loader inverted content="Fetching..." />
      </Dimmer>
    ) : (
      <div
        key={ employeeContractAddress}
        className="search-ele"
        onClick={ toRoute}
      >
        <div>
          <span>{ employeedata?.name}</span>
          <span>{ employeedata?.location}</span>
        </div>
        <small>{employeedata?.ethAddress}</small>
        <br />
        <small>{ employeedata?.description}</small>
      </div>
    );
 }

export default withRouter(SearchEmp);
