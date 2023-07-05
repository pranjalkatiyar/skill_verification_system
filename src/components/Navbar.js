import React, { useState,useEffect } from "react";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { Menu, Segment, Image, Label, Icon } from "semantic-ui-react";
import Admin from "../abis/Admin.json";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import GenererateQR from "./GenererateQR";

const Navbar = ()=> {
 
  const [activeItem, setActiveItem] = useState("home");
  const [role, setRole] = useState(-1);
  const [account, setAccount] = useState("");
  const [showQr, setShowQr] = useState(false);


  useEffect(async () => {
    const web3 = await window.web3;
    console.log(web3);
    const accounts = await web3.eth.getAccounts();
    if (accounts) {
      setAccount(accounts[0]);
     }
    const networkId = await web3.eth.net.getId();
    const AdminData = await Admin.networks[networkId];
    if (AdminData) {
      const admin = await new web3.eth.Contract(Admin.abi, AdminData.address);
      const isEmployee = await admin?.methods?.isEmployee(accounts[0]).call();
      const isOrganizationEndorser = await admin?.methods
        ?.isOrganizationEndorser(accounts[0])
        .call();
      const owner = await admin?.methods?.owner().call();
      var role = -1;
      if (accounts[0] === owner) {
        role = 0;
      } else if (isEmployee) {
        role = 1;
      } else if (isOrganizationEndorser) {
        role = 2;
      }
       setRole(role);
    } else {
      toast.error("The Admin Contract does not exist on this network!");
    }
  },[]);

  const handleItemClick = (e, { name }) => setActiveItem(name);

  const closeQRModal = () => {
    setShowQr(false);
   };

 const roles = ["Admin", "Employee", "Organization"];

    return (
      <>
        <GenererateQR
          isOpen={ showQr}
          closeQRModal={ closeQRModal}
        />
        <Segment
          inverted
          style={{
            borderRadius: "0",
            background: "#393646",

           }}
        >
          <Menu
            style={{ marginLeft: "80px", border: "none" }}
            inverted
            pointing
            secondary
          >
            <Menu.Item
              as={Link}
              to="/"
              style={{ marginRight: "25px", padding: "0px" }}
            >
              <div
                style={{
                  background: "white",
                  display: "grid",
                  justifyItems: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "50px",
                  width: "50px",
                  borderRadius: "100%",
                  padding: "10px",
                  marginBottom: "-5px",
                }}
              >
                <Image src="https://static.thenounproject.com/png/3293529-200.png" />
              </div>
            </Menu.Item>
            <Menu.Item
              style={{ marginRight: "25px", padding: "0px" }}
              position="left"
            >
              <SearchBar />
            </Menu.Item>
            { role === 0 && (
              <>
                <Menu.Item
                  as={Link}
                  to="/"
                  name="Employees"
                  active={activeItem === "Employees"}
                  onClick={ handleItemClick}
                />
                <Menu.Item
                  as={Link}
                  to="/all-organization-endorser"
                  name="Organization Endorsers"
                  active={activeItem === "Organization Endorsers"}
                  onClick={ handleItemClick}
                />
                <Menu.Item
                  as={Link}
                  to="/create-user"
                  name="Create User"
                  active={activeItem === "Create User"}
                  onClick={ handleItemClick}
                />
                <Menu.Item
                  as={Link}
                  to="/notifications"
                  name="Notifications"
                  active={activeItem === "Notifications"}
                  onClick={ handleItemClick}
                />
              </>
            )}
            { role === 1 && (
              <>
                <Menu.Item
                  as={Link}
                  to="/"
                  name="Profile"
                  active={activeItem === "Profile"}
                  onClick={ handleItemClick}
                />
                <Menu.Item
                  as={Link}
                  to="/update-profile"
                  name="Update Profile"
                  active={activeItem === "Update Profile"}
                  onClick={ handleItemClick}
                />
                <Menu.Item
                  as={Link}
                  to="/notifications"
                  name="Notifications"
                  active={activeItem === "Notifications"}
                  onClick={ handleItemClick}
                />
              </>
            )}

            { role === 2 && (
              <>
                <Menu.Item
                  as={Link}
                  to="/"
                  name="Info Page"
                  active={activeItem === "Info Page"}
                  onClick={ handleItemClick}
                />
                <Menu.Item
                  as={Link}
                  to="/endorse-skill"
                  name="Endorse Skill"
                  active={activeItem === "Endorse Skill"}
                  onClick={ handleItemClick}
                />
                <Menu.Item
                  as={Link}
                  to="/endorse-section"
                  name="Endorse Section"
                  active={activeItem === "Endorse Section"}
                  onClick={ handleItemClick}
                />
                <Menu.Item
                  as={Link}
                  to="/notifications"
                  name="Notifications"
                  active={activeItem === "Notifications"}
                  onClick={ handleItemClick}
                />
              </>
            )}

            { role === -1 && (
              <>
                <Menu.Item
                  as={Link}
                  to="/"
                  name="Request Admin For Role"
                  active={activeItem === "Request Admin For Role"}
                  onClick={ handleItemClick}
                />
                <Menu.Item
                  as={Link}
                  to="/notifications"
                  name="Notifications"
                  active={activeItem === "Notifications"}
                  onClick={ handleItemClick}
                />
              </>
            )}

            <Menu.Item position="right">
              <Label style={{ color: "black", background: "white" }}>
                { role === -1 ? "No Role" : roles[ role]}
              </Label>
              &nbsp;&nbsp;&nbsp;
              <div style={{ color: "lightgray" }}>
                <em>
                  <small>{ account}</small>
                </em>
                &nbsp;&nbsp;&nbsp;
                <Icon
                  name="qrcode"
                  size="large"
                  style={{ color: "white", cursor: "pointer" }}
                  onClick={() =>setShowQr(true)}
                />
              </div>
            </Menu.Item>
          </Menu>
        </Segment>
      </>
    );
 }

export default withRouter(Navbar);
