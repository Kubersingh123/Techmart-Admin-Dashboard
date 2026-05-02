import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import StatusBadge from "../components/StatusBadge";
import api from "../services/api";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  const load = () => api.get(`/orders/${id}`).then((res) => setOrder(res.data));

  useEffect(() => {
    load();
  }, [id]);

  const updatePayment = async (paymentStatus) => {
    await api.put(`/orders/${id}/payment`, { paymentStatus });
    load();
  };

  if (!order) return <Loading />;

  return (
    <div className="page-stack">
      <div className="page-title-row">
        <div>
          <h2>Order #{order._id.slice(-6).toUpperCase()}</h2>
          <p>{new Date(order.orderDate).toLocaleString()}</p>
        </div>
        <Link className="btn btn-light" to="/orders">Back</Link>
      </div>
      <div className="grid-two">
        <section className="panel">
          <div className="panel-heading"><h2>Customer</h2></div>
          <p className="mb-1 fw-semibold">{order.customer?.name}</p>
          <p className="mb-1">{order.customer?.email}</p>
          <p className="mb-1">{order.customer?.phone}</p>
          <p className="mb-0">{order.customer?.address}</p>
        </section>
        <section className="panel">
          <div className="panel-heading"><h2>Status</h2></div>
          <div className="d-flex gap-3 flex-wrap">
            <span>Payment: <StatusBadge value={order.paymentStatus} /></span>
            <span>Order: <StatusBadge value={order.orderStatus} /></span>
          </div>
          <select className="form-select mt-3" value={order.paymentStatus} onChange={(e) => updatePayment(e.target.value)}>
            <option>Pending</option><option>Paid</option><option>Failed</option><option>Refunded</option>
          </select>
        </section>
      </div>
      <section className="panel">
        <div className="table-responsive">
          <table className="table align-middle">
            <thead><tr><th>Product</th><th>Price</th><th>Quantity</th><th>Total</th></tr></thead>
            <tbody>
              {order.products.map((item) => (
                <tr key={item.product?._id || item.name}>
                  <td>{item.name}</td>
                  <td>Rs. {item.price.toLocaleString()}</td>
                  <td>{item.quantity}</td>
                  <td>Rs. {(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot><tr><th colSpan="3">Grand Total</th><th>Rs. {order.totalAmount.toLocaleString()}</th></tr></tfoot>
          </table>
        </div>
      </section>
    </div>
  );
}
