import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./AdminHome.css";

const AdminHome = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(""); 
  const [evaluations, setEvaluations] = useState([]);
  const [exportPopupVisible, setExportPopupVisible] = useState(false);
  const [selectedExportTeam, setSelectedExportTeam] = useState("all");

  const handleExport = async () => {
  let url = "https://three60-feedback-tracking.onrender.com/api/export360";
  if (selectedExportTeam && selectedExportTeam !== "all") {
    url += `?team=${encodeURIComponent(selectedExportTeam)}`;
  }
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      alert("ไม่พบข้อมูลสำหรับ export");
      return;
    }
    // map field เป็นแบบที่ต้องการ (ไม่ต้องแก้อะไร ถ้า BE ส่งตรง)
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "360 Results");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `360_Results_${selectedExportTeam || "All"}_${new Date().toISOString().slice(0,10)}.xlsx`);
    setExportPopupVisible(false);
  } catch (err) {
    console.error("Export error", err);
    alert("Export error: " + err.message);
  }
};

useEffect(() => {
  fetch("https://three60-feedback-tracking.onrender.com/api/users")
    .then((res) => res.json())
    .then((data) => {
      const users = Array.isArray(data) ? data : data.users || [];
      setAllUsers(users);

      const uniqueTeams = [...new Set(users.map((item) => item.department))]
        .filter(team => team && team.trim().toLowerCase() !== "all");

      setTeams(uniqueTeams);

      const savedTeam = sessionStorage.getItem("selectedTeam");
      if (savedTeam && uniqueTeams.includes(savedTeam)) {
        setSelectedTeam(savedTeam);
      } else if (uniqueTeams.length > 0) {
        setSelectedTeam(uniqueTeams[0]);
      }
    })
    .catch((err) => {
      console.error("Failed to load users", err);
      setAllUsers([]); // fallback to empty array
    });

  fetch("https://three60-feedback-tracking.onrender.com/api/evaluation_relations")
    .then((res) => res.json())
    .then((data) => {
      const evals = Array.isArray(data) ? data : data.evaluations || [];
      console.log("💡 Loaded evaluations:", evals);
      setEvaluations(evals);
    })
    .catch((err) => {
      console.error("Failed to load evaluations", err);
      setEvaluations([]); // fallback to empty array
    });
}, []);

    const getEvaluatorStatus = (evaluatorId, teamName) => {
      const teamMembers = allUsers.filter(u => u.department === teamName);

      const myEvals = evaluations.filter(e => {
        if (e.evaluator_id !== evaluatorId || e.team_name !== teamName) return false;

        if (e.evaluator_id === e.evaluatee_id) return true;

        return teamMembers.some(m => m.userid === e.evaluatee_id);
      });

      if (myEvals.length === 0) return "incompleted";

      const completedCount = myEvals.filter(e => e.status === "Completed").length;
      const inProgressCount = myEvals.filter(e => e.status === "In Progress").length;

      if (completedCount === teamMembers.length) {
        return "completed";
      } else if (inProgressCount > 0 || completedCount > 0) {
        return "inprogress";
      } else {
        return "incompleted";
      }
    };



  const filteredUsers = allUsers.filter((u) => u.department === selectedTeam);
  const evaluators = filteredUsers;

  const statusCount = (status) => {
    if (status === "all") {
        return filteredUsers.length;
    }
    return filteredUsers.filter((user) => {
        const userStatus = getEvaluatorStatus(user.userid, selectedTeam);
        return userStatus === status;
    }).length;
};


  const statusIcons = {
    completed: { icon: <FaCheckCircle color="green" />, text: "Completed" },
    inprogress: { icon: <FaHourglassHalf color="orange" />, text: "In Progress" },
    incompleted: { icon: <FaTimesCircle color="red" />, text: "Incompleted" },
    };

  const navigate = useNavigate();

  const handleView = (userId) => {
  navigate(`/admin-dashboard/${userId}`, {
    state: { team: selectedTeam }  
  });
};

  return (
    <div className="admin-home-container">
      <div className="admin-header">
        <div className="title">360 Feedback Report Tracking</div>
        <div className="admin-icon">Admin</div>
      </div>

      <div className="dropdown-container">
        <div className="dropdown-left">
          <label>Select Team:</label>
          <select
            className="role-select"
            value={selectedTeam}
            onChange={(e) => {
              setSelectedTeam(e.target.value);
              sessionStorage.setItem("selectedTeam", e.target.value);
            }}
          >
            {teams.map((team, index) => (
              <option key={index} value={team}>
                {team} {/* แสดงชื่อเต็ม เช่น FLP17 : Energy Saving */}
              </option>
            ))}
          </select>
        </div>

        <button
          className="export-button"
          onClick={() => setExportPopupVisible(true)}
        >
          Export
        </button>
      </div>

      <div className="summary-cards">
        <div className="summary-card all">
          <div>All</div>
          <div className="count">{statusCount("all")}</div>
        </div>
        <div className="summary-card complete">
          <div>Complete</div>
          <div className="count">{statusCount("completed")}</div>
        </div>
        <div className="summary-card incomplete">
          <div>Incomplete</div>
          <div className="count">{statusCount("incompleted")}</div>
        </div>
      </div>

      <table className="evaluate-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Dashboard</th>
          </tr>
        </thead>
        <tbody>
        {evaluators.map((evaluator, index) => {
            const userStatus = getEvaluatorStatus(evaluator.userid, selectedTeam);
            return (
            <tr key={index}>
                <td>{evaluator.userid}</td>
                <td>{evaluator.name}</td>
                <td className={`status ${userStatus}`}>
                {statusIcons[userStatus]?.icon} {statusIcons[userStatus]?.text}
                </td>
                <td>
                <button className="view-button" onClick={() => handleView(evaluator.userid)}>
                    <FaEye />
                </button>
                </td>
            </tr>
            );
        })}
        </tbody>

      </table>
      {exportPopupVisible && (
  <div className="export-popup">
    <div className="popup-content">
      <h4>Select team to export</h4>
      <select
        value={selectedExportTeam}
        onChange={(e) => setSelectedExportTeam(e.target.value)}
      >
        <option value="all">All</option>
          {teams
            .filter(team => team.toLowerCase() !== "all")
            .map((team, index) => (
              <option key={index} value={team}>
                {team}
              </option>
          ))}

        </select>
        <div className="popup-buttons">
          <button onClick={handleExport}>Export</button>
          <button onClick={() => setExportPopupVisible(false)}>Cancel</button>
        </div>
      </div>
    </div>
  )}
    </div>
    
  );
};

export default AdminHome;