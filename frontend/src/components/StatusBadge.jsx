const statusClass = {
  Active: "status-success",
  Inactive: "status-muted",
  Pending: "status-warning",
  Paid: "status-success",
  Failed: "status-danger",
  Refunded: "status-info",
  Processing: "status-primary",
  Shipped: "status-info",
  Delivered: "status-success"
};

export default function StatusBadge({ value }) {
  return <span className={`status-badge ${statusClass[value] || "status-muted"}`}>{value}</span>;
}
