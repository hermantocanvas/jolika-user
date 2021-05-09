import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import Modal from "react-responsive-modal";

function OrdersItem({ order }) {
  const [modalIsOpen, setModal] = useState(false);
  const [program, setProgram] = useState({
    name: "",
  });
  const { name } = program;

  useEffect(() => {
    loadProgram();
    //eslint-disable-next-line
  }, []);

  async function loadProgram() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/programs/${order.scheduleId.program}`
      );

      setProgram({
        name: res.data.data.name,
      });
    } catch (error) {
      console.log(error);
    }
  }

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

  const openModal = () => {
    setModal(true);
  };
  const closeModal = () => {
    setModal(false);
  };

  return (
    <>
    <tr>
      <td>{moment(order.orderDate).format("DD MMM YYYY")}</td>
      <td>
        {name}
        <br />
        {moment(order.scheduleId.date).format("DD MMM YYYY")}
        <br />
        {order.scheduleId.startTime} - {order.scheduleId.endTime}
      </td>
      <td>
        {formatter.format(order.unitPrice)} /tiket
        <br />
        {order.quantity} tiket
        <br />
        Total Harga: {formatter.format(order.productAmount)}  
        <br />
        {order.voucherDiscAmount > 0 &&
          `Voucher: -${formatter.format(order.voucherDiscAmount)}`}
        <br />
        {order.redeemAmount > 0 &&
          `Redeem: -${formatter.format(order.redeemAmount)}`}
      </td>
      <td>{formatter.format(order.grandTotal)}</td>
      <td>{order.orderStatus}</td>
      <td data-title="View Detail">
        <button className="btn btn-success" onClick={openModal}>
          <i className="fa fa-eye"></i>
        </button>
      </td>
    </tr>

<Modal open={modalIsOpen} onClose={closeModal} classNames="customModal">
<h2
  style={{
    fontSize: "25px",
    fontWeight: "normal",
    textAlign: "center",
    textTransform: "capitalize",
  }}
>
  Order Data:
</h2>
<br />
<h4>Participants:</h4>
<hr />
<table style={{width:'100%'}}>
  <tr style={{borderBottom:'1px solid #ddd'}}>
    <td>No</td>
    <td>Name</td>
    <td>Email</td>
    <td>Handphone</td>
  </tr>
  {order.participants.map((item, index) => {
    return (
      <tr style={{borderBottom:'1px solid #ddd'}}>
        <td>{index + 1}</td>
        <td>{item.name}</td>
        <td>{item.email}</td>
        <td>{item.handphone}</td>
    </tr>
    );
  })}
</table>
<br />
<table style={{width:'100%'}}>
  <tr>
    <td>
      <p>
        <label>Payment Type:</label><br />{order.paymentType}
        <br />
        <label>Paid Date:</label> {moment(order.paidDate).format("DD MMM YYYY")}
        <br />
        <label>Early Bird?:</label> {order.isEarlyBird ? 'yes' : 'no'}
        <br />
        <label>Price/item:</label> {formatter.format(order.unitPrice)}
        <br />
        <label>Qty:</label> {order.quantity}
        <br />
        <label>Product Total:</label> {formatter.format(order.productAmount)}
        <br />
        <label>Voucher Code:</label> {order.voucherCode ? order.voucherCode : '-'}
        <br />
        <label>Voucher Discount:</label> {formatter.format(order.voucherDiscAmount)}
        <br />
        <label>Referral Code:</label> {order.referralCode ? order.referralCode : '-'}
        <br />
        <label>Referral Redeem:</label> {formatter.format(order.redeemAmount)}
        <br />
        <label>Admin Bank:</label> {formatter.format(order.espayFee)}
        <br />
        <label>Grand Total:</label> {formatter.format(order.grandTotal)}
        
      </p>
    </td>
    <td>
      <p>
        <label>Schedule Date:</label> {moment(order.scheduleId.date).format("DD MMM YYYY")}
        <br />
        <label>Program:</label> {program.name}
        <br />
        <label>Start Time:</label> {order.scheduleId.startTime}
        <br />
        <label>End Time:</label> {order.scheduleId.endTime}
      </p>
    </td>
  </tr>
</table>
<br />
<button onClick={closeModal} style={{ float: "right" }}>
  Close
</button>
</Modal>
</>
  );
}

export default OrdersItem;
