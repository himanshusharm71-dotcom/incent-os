import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={styles.nav}>
      <h2>INCENT OS</h2>

      <div style={styles.links}>
        <Link to="/">Dashboard</Link>
        <Link to="/team">Team</Link>
        <Link to="/tasks">Tasks</Link>
        <Link to="/leaderboard">Leaderboard</Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px",
    background: "#111",
    color: "#fff"
  },
  links: {
    display: "flex",
    gap: "15px"
  }
};

export default Navbar;