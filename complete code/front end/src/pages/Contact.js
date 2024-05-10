import React from "react";
import Layout from "../components/Layout/Layout";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ContactUs from "../assets/ContactUs.jpg";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";

const Contact = () => {
  return (
    <Layout title={"Contact US- Shop Easy"}>
      <div className=" p-5">
        <div className="container m-2">
          <div className="text-center">
            <h3>GET IN TOUCH</h3>
            <p>For more information and queries, please fill this form.</p>
          </div>
          <Container fluid>
            <Row>
              <Col size="sm">
                <Image src={ContactUs} fluid />
              </Col>
              <Col>
                <div>
                  <Form>
                    <Form.Control
                      type="email"
                      className="m-2 p-0 fs-6"
                      placeholder="Enter your e-mail"
                    />

                    <Form.Control
                      as="textarea"
                      className="m-2 p-0 fs-6"
                      rows={3}
                      placeholder="Message"
                    />

                    <Button variant="primary" size="sm">
                      Submit
                    </Button>
                  </Form>
                </div>
              </Col>
            </Row>
          </Container>
          <div className="m-2 p-1 fs-3 text-center border">
            <p>Follow us</p>
            <a href="https://in.linkedin.com/in">@Linkedin</a> ||
            <a href="https://in.facebook.com">@FaceBook</a> ||
            <a href="https://in.x.com">@X</a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
