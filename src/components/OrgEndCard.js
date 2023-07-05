import React, { useState,useEffect } from "react";
import "./OrgEndCard.css";
import OrgEnd from "../abis/OrganizationEndorser.json";
import { Card } from "semantic-ui-react";

const OrgEndCard = (props)=> {
 
  const [orgEndInfo, setOrgEndInfo] = useState({});
  const [allEmployeesInOrg, setAllEmployeesInOrg] = useState([]);

  useEffect(async () => {
    const web3 = window.web3;
    const OrgEndContract = await new web3.eth.Contract(
      OrgEnd.abi,
      props.OrgEndContractAddress
    );

    const orgEndData = await OrgEndContract.methods
      .getOrganizationInfo()
      .call();
    const orgEndInfo = {
      ethAddress: orgEndData[1],
      name: orgEndData[0],
      location: orgEndData[2],
      description: orgEndData[3],
    };

    const employeeCount = await OrgEndContract.methods.totalEmployees().call();

    const allEmployeesInOrg = await Promise.all(
      Array(parseInt(employeeCount))
        .fill()
        .map((ele, index) =>
          OrgEndContract.methods.getEmployeeByIndex(index).call()
        )
    );
    setOrgEndInfo(orgEndInfo);
    setAllEmployeesInOrg(allEmployeesInOrg);
   },[]);

     return (
      <Card className="organization-card">
        <Card.Content>
          <Card.Header>
            <span>{ orgEndInfo?.name}</span>
            <small>{ orgEndInfo?.ethAddress}</small>
          </Card.Header>
          <br></br>
          <div>
            <p>
              <em>Location : </em>
              <span style={{ color: "#c5c6c7" }}>
                { orgEndInfo?.location}
              </span>
            </p>
          </div>
          <br />
          <div>
            <em>Description :</em>
            <p style={{ color: "#c5c6c7" }}>
              { orgEndInfo?.description}
            </p>
          </div>
          <br />
          <div>
            <p>
              <em>Employee Count: </em>
              <span style={{ color: "#c5c6c7" }}>
                { allEmployeesInOrg?.length}
              </span>
            </p>
          </div>
        </Card.Content>
      </Card>
    );
 }

 export default OrgEndCard;
