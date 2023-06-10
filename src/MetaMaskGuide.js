import React from "react";
import { Segment, Button, Image } from "semantic-ui-react";

const MetaMaskGuide = () => {
  return (
    <Segment
      placeholder
      textAlign="center"
      style={{
        alignSelf: "center",
        justifySelf: "center",
        width: "100vw",
         height: "100vh",
         color: "black",
        fontFamily: "Geologica",
        backgroundColor: "#F8EAD8",
      }}
    >
      <Image
        src="https://cdn.worldvectorlogo.com/logos/metamask.svg"
        width="200px"
        centered
      />

      <h1>Oops!.. Seems like you do not have Metamask extension.</h1>
      <h2>Please download it to proceed.</h2>
      <p>
        After the metamask set-up , create an account on <b>Goerli</b> test
        network.
      </p>
      <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en">
        <Button color="black">Download Metamask Extension</Button>
      </a>
    </Segment>
  );
};

export default MetaMaskGuide;
