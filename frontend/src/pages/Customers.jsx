import { IndianRupee, RotateCcw, UserRound, Users } from "lucide-react";
import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import api from "../services/api";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/customers").then((res) => setCustomers(res.data));
    api.get("/orders").then((res) => setOrders(res.data));
  }, []);

  const viewHistory = async (id) => {
    const { data } = await api.get(`/customers/${id}`);
    setSelected(data);
  };
  const selectedTotalSpend = selected?.orders.reduce((sum, order) => sum + order.totalAmount, 0) || 0;
  const selectedLastOrder = selected?.orders[0];
  const orderCountByCustomer = orders.reduce((summary, order) => {
    const customerId = order.customer?._id || order.customer;
    if (!customerId) return summary;
    summary[customerId] = (summary[customerId] || 0) + 1;
    return summary;
  }, {});
  const repeatCustomers = Object.values(orderCountByCustomer).filter((count) => count > 1).length;

  return (
    <div className="page-stack">
      <div className="page-title-row">
        <div>
          <h2>Customers</h2>
          <p>View customer contact details and order history.</p>
        </div>
      </div>
      <div className="stats-grid compact">
        <StatCard label="Total Customers" value={customers.length} icon={Users} />
        <StatCard label="Repeat Customers" value={repeatCustomers} icon={RotateCcw} tone="green" />
        <StatCard label="Selected Spend" value={`Rs. ${selectedTotalSpend.toLocaleString()}`} icon={IndianRupee} tone="amber" />
        <StatCard label="Selected Orders" value={selected?.orders.length || 0} icon={UserRound} tone="blue" />
      </div>
      <div className="grid-two customer-layout">
        <section className="panel data-panel">
          <div className="panel-heading rich-heading">
            <div>
              <h2>Customer Directory</h2>
              <p>Open a customer to review contact details and buying history.</p>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th></th></tr></thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan="4">
                      <div className="empty-state">
                        <strong>No customers found</strong>
                        <span>Customers will appear here after orders are created.</span>
                      </div>
                    </td>
                  </tr>
                ) : customers.map((customer) => (
                  <tr key={customer._id}>
                    <td>{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td className="text-end"><button className="btn btn-sm btn-soft" onClick={() => viewHistory(customer._id)}>History</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="panel customer-history-panel">
          <div className="panel-heading rich-heading">
            <div>
              <h2>Order History</h2>
              <p>Customer spending, last order and fulfillment status.</p>
            </div>
          </div>
          {!selected ? <div className="empty-state"><strong>Select a customer</strong><span>Order history and spending summary will appear here.</span></div> : (
            <>
              <div className="customer-profile-card">
                <div className="avatar-circle">{selected.customer.name.slice(0, 2).toUpperCase()}</div>
                <div>
                  <h3>{selected.customer.name}</h3>
                  <p>{selected.customer.email} • {selected.customer.phone}</p>
                  <small>{selected.customer.address}</small>
                </div>
              </div>
              <div className="history-summary">
                <div><span>Total Spend</span><strong>Rs. {selectedTotalSpend.toLocaleString()}</strong></div>
                <div><span>Orders</span><strong>{selected.orders.length}</strong></div>
                <div><span>Last Order</span><strong>{selectedLastOrder ? `#${selectedLastOrder._id.slice(-6).toUpperCase()}` : "N/A"}</strong></div>
              </div>
              {selected.orders.length === 0 ? <div className="empty-state"><strong>No orders yet</strong><span>This customer has no order history.</span></div> : selected.orders.map((order) => (
                <div className="history-row" key={order._id}>
                  <span>#{order._id.slice(-6).toUpperCase()}</span>
                  <strong>Rs. {order.totalAmount.toLocaleString()}</strong>
                  <StatusBadge value={order.orderStatus} />
                </div>
              ))}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
