import React from "react";
import Layout from "../components/Layout/Layout";
import cartImage from "../assets/cartImage.jpg";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";

const About = () => {
  return (
    <Layout title={"About- Shop Easy"}>
      <div className="p-3">
        <div className=" container p-3">
          <div className="text-center mb-4">
            <h3>Shop Easy</h3>
            <h5 className="mt-2">Making Shopping Easy For EveryOne</h5>
          </div>
          <Container fluid="xl">
            <Row>
              <Col md="auto">
                <Image src={cartImage} fluid />
              </Col>
              <Col>
                <div>
                  <p className="mt-2 fs-5">
                    At Shop Easy, we believe that looking and feeling your best
                    shouldn't be complicated. Our mission is to provide you with
                    a seamless shopping experience, offering high-quality
                    clothing and skincare products at affordable prices.
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
      {/* <div className="follow">
        <a href="https://in.linkedin.com/in/priya-harshavardhana-94745559">
          Follow me on linkedin
        </a>
      </div>
      <div className="touch">
        <h3>GET IN TOUCH</h3>
        For more information and queries, please fill this form.
        <form action method="post">
          <table>
            <tbody>
              <tr>
                <td>
                  <input type="text" name="name" placeholder="Name" />
                  <input type="email" name="email" placeholder="Email" />
                  <textarea
                    name="message"
                    cols={30}
                    rows={10}
                    placeholder="Message"
                    defaultValue={""}
                  />
                  <button>Submit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div> */}
    </Layout>
  );
};

export default About;
