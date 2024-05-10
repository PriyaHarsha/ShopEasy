import React, { Fragment, useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import CategoryForm from "../../components/Form/CategoryForm";
import Modal from "react-bootstrap/Modal";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [selected, setSelected] = useState({});
  const [catId, setCatId] = useState(false);
  const [modalShow1, setModalShow1] = useState(false);

  //handle form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/v1/category/create-category", {
        name,
      });
      if (res.data?.success) {
        toast.success(`Category - ${name} is created succesfully`);
        getAllCategory();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong while creating category");
    }
    setName("");
  };

  //handle delete
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`/api/v1/category/delete-category/${id}`);
      if (res.data?.success) {
        toast.success(res.data.message);
        getAllCategory();
        setModalShow1(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong in deleting category");
    }
  };

  //handle edit
  const handleEdit = async (e) => {
    e.preventDefault();
    const id = selected._id;
    const name = updatedName;
    try {
      const res = await axios.put(`/api/v1/category/update-category/${id}`, {
        name,
      });
      if (res.data?.success) {
        toast.success(`Category - ${name} is updated successfully`);
        getAllCategory();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong while updateing category");
    }
    setUpdatedName("");
    setModalShow(false);
    setSelected(null);
  };

  //Load all categories
  const getAllCategory = async () => {
    try {
      const res = await axios.get("/api/v1/category/getall-category");

      if (res?.data?.success) {
        setCategories(res.data.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  return (
    <Layout title={"create-category- Shop Easy"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <AdminMenu />
        </div>
        <div className="row text-center">
          <div className=" m-3 p-3 border">
            <h1>Create New Category</h1>
            <div className=" d-flex justify-content-center mt-4 mb-4">
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
              />
            </div>
            <hr />
            <h1>All Categories</h1>

            <div>
              <table className="table text-center table-striped border">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.map((category) => {
                    return (
                      <Fragment key={category._id}>
                        <tr>
                          <td>{category.name}</td>
                          <td>
                            <button
                              className="btn btn-primary p-1"
                              onClick={() => {
                                setModalShow(true);
                                setUpdatedName(category.name);
                                setSelected(category);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger p-2 m-2"
                              onClick={(e) => {
                                setCatId(category._id);
                                setModalShow1(true);
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton></Modal.Header>
          <div className="m-5">
            <CategoryForm
              value={updatedName}
              setValue={setUpdatedName}
              handleSubmit={handleEdit}
            ></CategoryForm>
          </div>
        </Modal>

        <Modal
          show={modalShow1}
          onHide={() => setModalShow1(false)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton></Modal.Header>
          <div className="m-5">
            <h3>Are you sure you want to delete Category</h3>
            <button
              className="btn btn-danger p-2 m-2"
              onClick={(e) => {
                setModalShow1(false);
              }}
            >
              No
            </button>
            <button
              className="btn btn-danger p-2 m-2"
              onClick={(e) => {
                handleDelete(catId);
              }}
            >
              Confirm
            </button>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default CreateCategory;
