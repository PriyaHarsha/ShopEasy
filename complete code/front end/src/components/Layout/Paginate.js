import React from "react";
import Pagination from "react-bootstrap/Pagination";

const Paginate = ({ total, active, setActive }) => {
  let items = [];
  for (let number = 1; number <= Math.ceil(total / 12); number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === active}
        onClick={(e) => {
          setActive(number);
        }}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <div>
      <Pagination>{items}</Pagination>
    </div>
  );
};

export default Paginate;
