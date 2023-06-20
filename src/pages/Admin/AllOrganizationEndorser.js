import React, { Component ,useState,useEffect} from "react";
import { toast } from "react-toastify";
import Admin from "../../abis/Admin.json";
import LoadComp from "../../components/LoadComp";
import OrgEndCard from "../../components/OrgEndCard";
import { set } from "lodash";

const  AllOrganizationEndorser =()=> {
  // state = {
  //   orgends: [],
  //   loadcomp: false,
  // };
  
  const [orgends, setOrgends] = useState([]);
  const [loadcomp, setLoadcomp] = useState(false);

  useEffect(async()=>{
    setLoadcomp(true);  
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    if (AdminData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
      const orgendCount = await admin?.methods
        .OrganizationEndorserCount()
        .call();
      const orgends = await Promise.all(
        Array(parseInt(orgendCount))
          .fill()
          .map((ele, index) =>
            admin.methods.getOrganizationContractByIndex(index).call()
          )
      );
      // this.setState({ orgends });
      setOrgends(orgends);
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
    setLoadcomp(false);
    // this.setState({ loadcomp: false });

  },[]);

  // componentDidMount = async () => {
  //   this.setState({ loadcomp: true });
    
  // };

     return loadcomp ? (
      <LoadComp />
    ) : (
      <div className="admin">
        <h2 className="card-heading">All Registered Organization-Endorser</h2>
        <br />
        {orgends?.map((orgend, index) => (
          <OrgEndCard key={index} OrgEndContractAddress={orgend} />
        ))}
        <br />
      </div>
    );
  }


export default AllOrganizationEndorser;