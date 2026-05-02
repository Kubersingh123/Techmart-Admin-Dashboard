export default function StatCard({ label, value, icon: Icon, tone = "blue" }) {
  return (
    <div className={`stat-card tone-${tone}`}>
      <div className="stat-copy">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>Live data</small>
      </div>
      {Icon && (
        <div className="stat-icon">
          <Icon size={24} />
        </div>
      )}
    </div>
  );
}
