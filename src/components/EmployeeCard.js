import React, { Component,useEffect,useState } from "react";
import { withRouter } from "react-router-dom";
import { Card } from "semantic-ui-react";
import Employee from "../abis/Employee.json";
import "./EmployeeCard.css";
import LoadComp from "./LoadComp";

const EmployeeCard=(props)=> {
  // state = {
  //   employeedata: {},
  //   skills: [],
  //   certifications: [],
  //   workExps: [],
  //   educations: [],
  //   colour: ["#b6e498", "#61dafb", "#764abc", "#83cd29", "#00d1b2"],
  //   readmore: false,
  //   loadcomp: false,
  // };

  const [employeeData,setEmployeeData] = useState({});
  const [skills,setSkills] = useState([]);
  const [certifications,setCertifications] = useState([]);
  const [workExps,setWorkExps] = useState([]);
  const [educations,setEducations] = useState([]);
  const [colour,setColour] = useState(["#b6e498", "#61dafb", "#764abc", "#83cd29", "#00d1b2"]);
  const [readMore,setReadMore] = useState(false);
  const [loadComp,setLoadComp] = useState(false);

  useEffect(async()=>{
    const web3 = window.web3;
    const EmployeeContract = await new web3.eth.Contract(
      Employee.abi,
      props.employeeContractAddress
    );
    getSkills(EmployeeContract);
    getCertifications(EmployeeContract);
    getWorkExp(EmployeeContract);
    getEducation(EmployeeContract);
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
    setEmployeeData(newEmployedata);
  },[]);


  // componentDidMount = async () => {
   
    // this.setState({ employeedata: newEmployedata });
  // };

  const getSkills = async (EmployeeContract) => {
    const skillCount = await EmployeeContract?.methods?.getSkillCount().call();
    const skills = await Promise.all(
      Array(parseInt(skillCount))
        .fill()
        .map((ele, index) =>
          EmployeeContract?.methods?.getSkillByIndex(index).call()
        )
    );

    var newskills = [];
    skills.forEach((certi) => {
      newskills.push({
        name: certi[0],
        overall_percentage: certi[1],
        experience: certi[2],
        endorsed: certi[3],
        endorser_address: certi[4],
        review: certi[5],
      });
      return;
    });
    setSkills(newskills); 
    // this.setState({ skills: newskills });
  };

  const getCertifications = async (EmployeeContract) => {
    const certiCount = await EmployeeContract?.methods
      ?.getCertificationCount()
      .call();
    const certifications = await Promise.all(
      Array(parseInt(certiCount))
        .fill()
        .map((ele, index) =>
          EmployeeContract?.methods?.getCertificationByIndex(index).call()
        )
    );
    var newcertifications = [];
    certifications.forEach((certi) => {
      newcertifications.push({
        name: certi[0],
        organization: certi[1],
        score: certi[2],
        endorsed: certi[3],
      });
      return;
    });
    setCertifications(newcertifications);
    // this.setState({ certifications: newcertifications });
  };

  const getWorkExp = async (EmployeeContract) => {
    const workExpCount = await EmployeeContract?.methods
      ?.getWorkExpCount()
      .call();
    const workExps = await Promise.all(
      Array(parseInt(workExpCount))
        .fill()
        .map((ele, index) =>
          EmployeeContract?.methods?.getWorkExpByIndex(index).call()
        )
    );

    var newworkExps = [];
    workExps.forEach((work) => {
      newworkExps.push({
        role: work[0],
        organization: work[1],
        startdate: work[2],
        enddate: work[3],
        endorsed: work[4],
        description: work[5],
      });
      return;
    });

    setWorkExps(newworkExps);
    // this.setState({ workExps: newworkExps });
  };

  const getEducation = async (EmployeeContract) => {
    const educationCount = await EmployeeContract?.methods
      ?.getEducationCount()
      .call();
    const educations = await Promise.all(
      Array(parseInt(educationCount))
        .fill()
        .map((ele, index) =>
          EmployeeContract?.methods?.getEducationByIndex(index).call()
        )
    );
    var neweducation = [];
    educations.forEach((certi) => {
      neweducation.push({
        institute: certi[0],
        startdate: certi[1],
        enddate: certi[2],
        endorsed: certi[3],
        description: certi[4],
      });
      return;
    });
    setEducations(neweducation);
    // this.setState({ educations: neweducation });
  };

  const toEmployee = () => {
    props.history.push(
      `/getemployee/${props.employeeContractAddress}`
    );
  };

     return loadComp ? (
      <LoadComp />
    ) : (
      <Card className="employee-card">
        <Card.Content>
          <Card.Header onClick={toEmployee} style={{ cursor: "pointer" }}>
            <span>{employeeData?.name}</span>
            <small>{employeeData.ethAddress}</small>
          </Card.Header>
          <br></br>
          <div>
            <p>
              <em>Location : </em>
              <span style={{ color: "#c5c6c7" }}>
                {employeeData?.location}
              </span>
            </p>
          </div>
          <br />
          <div>
            <em>Description :</em>
            <p style={{ color: "#c5c6c7" }}>
              {employeeData?.description}
            </p>
          </div>
          <br />
          <div>
            <em>Skills:</em>
            <div className="skill-holder">
              {skills?.map((skill, index) => (
                <div
                  className="skill-design"
                  style={{
                    color: "#c5c6c7",
                    border: `1px solid ${colour[index % 5]}`,
                  }}
                >
                  <p>{skill.name}</p>
                </div>
              ))}
            </div>
          </div>
          <br />
          {readMore ? (
            <div>
              <div>
                <em>Education:</em>
                <div className="education">
                  {educations?.map((education, index) => (
                    <div
                      className="education-design"
                      style={{ color: "#c5c6c7" }}
                    >
                      <div>
                        <p>{education.description}</p>
                        <small>{education.institute}</small>
                      </div>
                      <div>
                        <small>
                          <em>
                            {education.startdate} - {education.enddate}
                          </em>
                        </small>
                        <p
                          style={{
                            color: education.endorsed ? "#00d1b2" : "yellow",
                            opacity: "0.7",
                          }}
                        >
                          {education.endorsed ? "Endorsed" : "Not Yet Endorsed"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <br />
              <div>
                <em>Certifications:</em>
                <div className="certifications">
                  {certifications?.map((certification, index) => (
                    <div
                      className="certification-design"
                      style={{ color: "#c5c6c7" }}
                    >
                      <div>
                        <p>{certification.name}</p>
                        <small>{certification.organization}</small>
                      </div>
                      <div>
                        <p>
                          <em>Score: {certification.score}</em>
                        </p>
                        <p
                          style={{
                            color: certification.endorsed
                              ? "#00d1b2"
                              : "yellow",
                            opacity: "0.7",
                          }}
                        >
                          {certification.endorsed
                            ? "Endorsed"
                            : "Not Yet Endorsed"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <br />
              <div>
                <em>Work Experience:</em>
                <div className="workexp">
                  {workExps?.map((work, index) => (
                    <div
                      className="workexp-design"
                      style={{ color: "#c5c6c7" }}
                    >
                      <div>
                        <p>{work.role}</p>
                        <small>{work.organization}</small>
                      </div>
                      <div>
                        <p>
                          <em>
                            <small>
                              {work.startdate} - {work.enddate}
                            </small>
                          </em>
                        </p>
                        <p
                          style={{
                            color: work.endorsed ? "#00d1b2" : "yellow",
                            opacity: "0.7",
                          }}
                        >
                          {work.endorsed ? "Endorsed" : "Not Yet Endorsed"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="readopenclose"
                onClick={() => setReadMore(false)}
              >
                <p>Hide</p>
              </div>
            </div>
          ) : (
            <div
              className="readopenclose"
              onClick={() => setReadMore(true)}
            >
              <p>...Read More</p>
            </div>
          )}
        </Card.Content>
      </Card>
    );
   
}

// export default withRouter(EmployeeCard);
export default EmployeeCard;