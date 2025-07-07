"use client";
import React, { useState } from "react";
import Button from "react-bootstrap/cjs/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/cjs/Col";
import Alert from "react-bootstrap/Alert";
import { fetchData } from "../assets/petitions/fetchData";
import { fetchLeads } from "../assets/petitions/fetchLeads";
import { animateScroll as scroll } from "react-scroll";
import LoadingMainForm from "./LoadingMainForm";

const ManualEmailForm = ({
  leads,
  setLeads,
  questions,
  dataUser,
  setDataUser,
  emailData,
  clientId,
  backendURLBase,
  endpoints,
  backendURLBaseServices,
  mainData,
  allDataIn,
  isLoading
}) => {
  const [showEmailPreview, setShowEmailPreview] = useState(true);
  const [valid, setValid] = useState(false);
  const [error, setError] = useState(false);
  const [showLoadSpin, setShowLoadSpin] = useState(false);

  const [emailMessage, setEmailMessage] = useState({});
  const [continueBtn, setcontinueBtn] = useState(true);
  
  
  // const handleMessageChange = (e) => {
  //   e.preventDefault();
  //   setDataUser({ ...emailData, [e.target.name]: e.target.value });
  //   console.log(dataUser.message, 'datauser')
  // };
  // const handleSubjectChange = (e) =>{
  //   e.preventDefault();
  //   setDataUser({ ...dataUser, [e.target.name]: e.target.value });
  //   console.log(dataUser.subject, 'datauser')
  // }
  const handleMessageChange = (e) => {
    e.preventDefault();
    setDataUser({
      ...dataUser,
      subject: e.target.name === "subject" ? e.target.value : dataUser.subject,
      message: e.target.name === "message" ? e.target.value : dataUser.message,
    });
    
    // console.log(dataUser);
  };
  const handleSend = async (e) => {
    e.preventDefault();
    let currentSubject = dataUser.message;
      const payload = await fetchData(
        "GET",
        backendURLBaseServices,
        endpoints.toSendBatchEmails,
        clientId,
        `to=${allDataIn}&subject=${currentSubject}&firstName=${
          dataUser.userName
        }&emailData=${
          dataUser.emailUser
        }&text=${dataUser.message.replace(/\n\r?/g, "<br/>")}`
      );
      const messageEmail = dataUser.message.replace(/\n\r?/g, "<br/>")
      if (payload.success === true) {
        fetchLeads(
          true,
          backendURLBase,
          endpoints,
          clientId,
          dataUser,
          emailData,
          messageEmail,
          'message-multiple-representatives-lead'
        );
      }
      if (payload.success !== true) {
        fetchLeads(
          false,
          backendURLBase,
          endpoints,
          clientId,
          dataUser,
          emailData,
          messageEmail,
          'message-multiple-representatives-not-sended-lead'
        );
        return (
          <Alert>
            The mail has not been sended succesfully, please try again later.
            <Button
              className={"button-email-form"}
              variant={"dark"}
              onClick={back}
            >
             Back
            </Button>
          </Alert>
        );
      }
      return;
  };
  const back = (e) => {
    e.preventDefault();
    console.log(dataUser, 'dataUser')
  };
  const loading = (cl) => {
    scroll.scrollTo(1000);
    return <LoadingMainForm cl={cl} />;
  };
  
  return (
    <>
      {isLoading == true ? (
              <div className="emailContainer">
                {loading("spinner-containerB")}

              </div>
            ) : (
            <div className={"emailContainer"}>
        {error ? (
          <Alert variant={"danger"}>
            All fields are required, please fill in the missing ones.
          </Alert>
        ) : null}
        <Form
          name="fm-email"
          onSubmit={handleSend}
          noValidate
          validated={valid}
        >
          <div>
          
          <div className="instructions-container">
              <h3 className="ia-instructions-title main-text-title">{mainData.titleNoAI ? mainData.titleNoAI : 'Write your email'}</h3>
            <p className="ia-instructions-p main-text-instruction">
              {mainData.intructionsNoAI? mainData.intructionsNoAI : 'Customer instructions for the user. Here the client can give the user recommendations on what to mention in the email and how to write the subject.'}
            </p>
          </div>
            
              <div>
                {" "}
                <div>
                  <Col>
                      <Form.Group>
                        <Form.Label className="subject-label">
                          Subject Line
                        </Form.Label>
                        <Form.Control
                          id="subject-emailform"
                          onChange={handleMessageChange}
                          name="subject"
                          type="text"
                          defaultValue={dataUser.subject}
                          className="subject-input"
                          
                        />
                      </Form.Group>
                   
                    <Form.Group>
                      <Form.Label className="subject-label">
                        Email
                      </Form.Label>
                      <Form.Control
                        id="message-emailform"
                        onChange={handleMessageChange}
                        as="textarea"
                        rows={12}
                        name="message"
                        defaultValue={dataUser.message}
                        className="email-ia-text-area"
                        required
                      />
                    </Form.Group>
                  </Col>
                </div>
                <div className={"container buttons-container-email-form btn-container-checklist"}>
                  <Button onClick={back} className={"button-email-form back-button"}>
                    Back
                  </Button>
                  <Button
                    onClick={handleSend}
                    className={"button-email-form secundary-btn"}
                    
                  >
                    Send!
                  </Button>
                </div>
              </div>
              
          </div>
        </Form>
        
        </div>
      )}
      
    </>
  );
};

export default ManualEmailForm;