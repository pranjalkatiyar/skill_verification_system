import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Button, Card, Dropdown, Form, Message } from "semantic-ui-react";
import "./NoRole.css";
import { messageAdmin } from "../../firebase/api.js";

const NoRole = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");

  const roleOptions = [
    {
      key: "0",
      text: "No-Role-Selected",
      value: "0",
    },
    {
      key: "1",
      text: "Employee",
      value: "1",
    },
    {
      key: "2",
      text: "OrganizationEndorser",
      value: "2",
    },
  ];

  const handleDropdownSelect = (e, data) => {
    setRole(data.value);
  };

  const handleName = (e) => {
    e.preventDefault();
    setName(e.target.value);
  };

  const handleLocation = (e) => {
    e.preventDefault();
    setLocation(e.target.value);
  };

  const handleDescription = (e) => {
    e.preventDefault();
    setDescription(e.target.value);
  };

  const handleMessage = (e) => {
    e.preventDefault();
    setMessage(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const info = {
      name,
      description,
      role,
      location,
    };
    await messageAdmin(info, message);
    setLoading(false);
    setName("");
    setDescription("");
    setRole("0");
    setLocation("");
    setMessage("");
  };

  return (
    <div className="norole">
      <Card className="card-style">
        <Card.Content>
          <Card.Header centered>
            <h2 className="card-heading">Message Admin</h2>
            <small className="norole-heading-subtext">
              Message admin to get added on the blockchain
            </small>
          </Card.Header>
          <hr className="horizontal-line"></hr>
          <br></br>
          <Form error={!! errorMessage}>
            <Form.Field className="form-inputs-admin">
              <input
                id="name"
                placeholder="Your Name"
                autoComplete="off"
                autoCorrect="off"
                value={ name}
                onChange={ handleName}
              />
            </Form.Field>
            <br />
            <Form.Field className="form-inputs-admin">
              <input
                id="location"
                placeholder="Your Location"
                autoComplete="off"
                autoCorrect="off"
                value={ location}
                onChange={ handleLocation}
              />
            </Form.Field>
            <br />
            <Form.Field className="form-inputs-admin">
              <input
                id="description"
                placeholder="Brief Description"
                autoComplete="off"
                autoCorrect="off"
                value={ description}
                onChange={ handleDescription}
              />
            </Form.Field>
            <br />
            <Form.Field className="form-inputs-admin">
              <Dropdown
                placeholder="Desired Role"
                fluid
                selection
                options={ roleOptions}
                onChange={ handleDropdownSelect}
              />
            </Form.Field>
            <br />
            <Form.Field className="form-inputs-admin">
              <textarea
                id="message"
                rows="4"
                placeholder="Short Message for Admin"
                autoComplete="off"
                autoCorrect="off"
                value={ message}
                onChange={ handleMessage}
              />
            </Form.Field>
            <br />
            <Message error header="Oops!!" content={ errorMessage} />
            <br />
            <div className="button-holder">
              <Button
                className="button-css-admin"
                type="submit"
                onClick={ handleSubmit}
                loading={ loading}
              >
                Send
              </Button>
            </div>
          </Form>
        </Card.Content>
      </Card>
      <br />
    </div>
  );
};

export default withRouter(NoRole);
