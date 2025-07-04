import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import "./EvaluationForm.css";

const scoreOptions = [
  { value: 1, label: "Not Demonstrate" },
  { value: 2, label: "Randomly Demonstrate" },
  { value: 3, label: "Often Demonstrate" },
  { value: 4, label: "Consistently Demonstrate" },
  { value: 5, label: "Role Model/Influence Other" },
];

const questionDescriptions = {
  compassion: "Empathy beyond caring. Always put our people and customers first, and help better their lives, communities, and the world. (คิดถึงผู้อื่นและส่วนรวมเสมือนเป็นตนเอง รู้สึกเห็นใจ และพร้อมทำความเข้าใจสุขทุกข์ของผู้อื่น เพื่อให้ทุกชีวิตและโลกของพวกเราดีขึ้นในทุกวัน)",
  credibility: "Always deliver on our promises with high performance, dedication, passion, and competency. (ความเชื่อใจที่สร้างจากความมุ่งมั่น ทุ่มเท และไม่ย่อท้อที่จะสร้างผลลัพธ์ให้ประสบความสำเร็จอย่างเต็มประสิทธิภาพเสมอ)",
  co_creation: "Embrace togetherness and collaborate with others, including external partners, to develop new and better solutions. (ร่วมแรงร่วมใจภายในเป็นหนึ่ง ประสานพลังและความร่วมมือกับพันธมิตรเพื่อร่วมสร้างสรรค์และเรียนรู้ในการพัฒนาสิ่งใหม่)",
  courage: "Dare to explore, despite challenges, with innovative thinking and in the rightful ways for our customers. (กล้าคิด กล้าลงมือทำสิ่งใหม่ ๆ แม้ต้องเผชิญกับความลำบากและท้าทาย พร้อมเปลี่ยนมุมมองเพื่อหาทางเลือกใหม่ ๆ ให้ตรงใจลูกค้าเสมอ)",

  productivity: "Strive to achieve excellent performance, productivity & economic values. Push beyond limits to generate revenue, reduce cost, and exceed customer's expectations. (พยายามบรรลุผลการปฏิบัติงานที่ยอดเยี่ยม ประสิทธิภาพการผลิต และคุณค่าทางเศรษฐกิจ ผลักดันขีดจำกัดเพื่อสร้างรายได้ ลดต้นทุน และเกินความคาดหวังของลูกค้า)",
  high_quality: "Continuously assess, develop, & deliver higher quality of works to ensure excellent products, solutions, & services. (ประเมิน พัฒนา และส่งมอบงานที่มีคุณภาพสูงขึ้นอย่างต่อเนื่อง เพื่อให้มั่นใจว่าผลิตภัณฑ์ โซลูชัน และบริการยอดเยี่ยม​)",
  dynamic_agile: "Understand current business situation and adapt self accordingly. Analyze business risk, recover quickly from crisis and provide solutions. (คล่องตัวและปรับตัวได้ เข้าใจสถานการณ์ธุรกิจปัจจุบันและปรับตัวเองให้เหมาะสม วิเคราะห์ความเสี่ยงทางธุรกิจ ฟื้นตัวจากวิกฤตอย่างรวดเร็ว และนำเสนอแนวทางแก้ไข​)",
  open_transparent: "Eager to learn, seek feedback & opportunities for further development. Break silos & work collaborative to achieve economic values. (เปิดกว้าง โปร่งใส และทำงานร่วมกัน:กระตือรือร้นในการเรียนรู้ แสวงหาผลตอบรับและโอกาสในการพัฒนาเพิ่มเติม ทำลายกรอบการทำงานที่แยกส่วน และทำงานร่วมกันเพื่อให้บรรลุคุณค่าทางเศรษฐกิจ​)",
  customer_centric: "Empathize with markets & customers' needs. Contribute to products & solutions solving their pain-points & promote loyalty. (เข้าใจความต้องการของตลาดและลูกค้า มีส่วนช่วยในการพัฒนาผลิตภัณฑ์และโซลูชันที่แก้ปัญหาของพวกเขา และส่งเสริมความภักดี)",
  data_driven: "Deliver results through accurate & meaningful data. Use data to track progress & find ways to enhance outcomes. Anticipate problems & offer solutions based on data. (ส่งมอบผลลัพธ์ผ่านข้อมูลที่แม่นยำและมีความหมาย ใช้ข้อมูลเพื่อติดตามความก้าวหน้าและค้นหาวิธีปรับปรุงผลลัพธ์ คาดการณ์ปัญหาและนำเสนอโซลูชันตามข้อมูล)",
  innovation: "Never settle for what is and seeks ways to improve on all aspects. Initiate new ideas, create prototype, fail quickly, and learn to improve. (ไม่หยุดอยู่แค่สิ่งที่มีอยู่และหาวิธีปรับปรุงทุกด้าน เริ่มต้นไอเดียใหม่ ๆ สร้างต้นแบบ ล้มเหลวอย่างรวดเร็ว และเรียนรู้เพื่อพัฒนา​)",
  empowerment: "Find ways for self & others to take actions effectively while considering calculated risks. Promote sense of trust & accountability within and across teams. (นหาวิธีที่ตัวเองและผู้อื่นสามารถดำเนินการได้อย่างมีประสิทธิภาพ โดยคำนึงถึงความเสี่ยงที่ประเมินได้ ส่งเสริมความไว้วางใจและความรับผิดชอบทั้งภายในและข้ามทีม​)",

  contribution_org: "งานที่ทำสำเร็จและมีผลต่อความสำเร็จขององค์กร",
  innovation_org: "Work that is creative or improved for the benefit of the organization. (งานที่สร้างสรรค์หรือปรับปรุงให้ดีขึ้นเพื่อองค์กร)",
  contribution_team_org: "Work that is completed and contributes to the success of the team. (งานที่ทำสำเร็จและมีผลต่อความสำเร็จของทีม)",
  contribution_org2: "ข้อมูลสนับสนุนด้านการสร้างคุณค่าให้กับองค์กร",
  innovation_org2: "ข้อมูลสนับสนุนด้านสร้างสรรค์สิ่งใหม่เพื่อองค์กร",
  contribution_team_org2:"ข้อมูลสนับสนุนด้านการสร้างคุณค่าให้กับทีม"
};

export default function EvaluationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const questionRefs = useRef({});
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({});
  const [evaluateeInfo, setEvaluateeInfo] = useState(null);
  const [hasSyncedInprogress, setHasSyncedInprogress] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [evaluatorId, setEvaluatorId] = useState("");
  const [currentStatus, setCurrentStatus] = useState("In Progress");
  const [hasLoadedStatus, setHasLoadedStatus] = useState(false);
  const [initialFormData, setInitialFormData] = useState({});
  const [showWarning, setShowWarning] = useState(false);
  const [goBackConfirmed, setGoBackConfirmed] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const location = useLocation();

  const scrollToQuestion = (sectionKey, questionId) => {
    const ref = questionRefs.current[`${sectionKey}-${questionId}`];
    if (ref && ref.scrollIntoView) {
      ref.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  useEffect(() => {
    if (location.state) {
      const { evaluatorId, evaluateeId, team, role } = location.state;
      setEvaluatorId(evaluatorId);
      setTeamName(team);
      setUserRole(role);
      setEvaluateeId(evaluateeId);
    } else {
      console.warn("⚠️ location.state ไม่มีค่า → ตรวจสอบการ navigate");
    }
  }, [location.state]);
  const [evaluateeId, setEvaluateeId] = useState("");

  useEffect(() => {
    fetch("https://three60-feedback-tracking.onrender.com/api/questions?form_id=1")
      .then(res => res.json())
      .then(data => setQuestions(data))
      .catch(err => console.error("Load questions failed:", err));
  }, []);

  // โหลดจาก backend evaluation_relations อย่างเดียว
    useEffect(() => {
      if (!id || !evaluatorId || !teamName || !userRole) return;

      fetch("https://three60-feedback-tracking.onrender.com/api/evaluation_relations")
        .then(res => res.json())
        .then(data => {
          const existing = data.find(e =>
            e.evaluatee_id === id &&
            e.evaluator_id === evaluatorId &&
            e.team_name === teamName &&
            e.relationship_role === userRole
          );

          if (existing) {
            setEvaluateeInfo({
              fullName: existing.evaluatee_name || id,
              Role: existing.relationship_role
            });
            setCurrentStatus(existing.status);
            setHasLoadedStatus(true);
            // ดึงฟีดแบคเก่าต่อ...
          }
        });
    }, [id, evaluatorId, teamName, userRole]);



  // Auto save ทุกครั้งที่ formData เปลี่ยนแปลง
useEffect(() => {
  if (!formData || !evaluatorId || !id || !teamName || !userRole || !hasLoadedStatus) return;
  if (justSubmitted) return;
  if (!hasStartedTyping) return;
  if (JSON.stringify(formData) === JSON.stringify(initialFormData)) return;

  const timeout = setTimeout(() => {
    const allSections = ['core', 'operational', 'performance', 'overall'];
    const answers = [];
    allSections.forEach(section => {
      const sectionData = formData[section] || {};
      Object.entries(sectionData).forEach(([qid, val]) => {
        if (!isNaN(val) && val !== "" && val !== undefined && val !== null) {
          answers.push({ question_id: parseInt(qid), score: parseInt(val), answer_text: null });
        } else {
          answers.push({ question_id: parseInt(qid), score: null, answer_text: val });
        }
      });
    });

    console.log("formData changed");
    console.log("hasStartedTyping:", hasStartedTyping);
    console.log("isFormChanged:", JSON.stringify(formData) !== JSON.stringify(initialFormData));

    fetch("https://three60-feedback-tracking.onrender.com/api/evaluation_relations", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        evaluator_id: evaluatorId,
        evaluatee_id: id,
        relationship_role: userRole,
        team_name: teamName,
        status: currentStatus === "Completed" ? "Completed" : "In Progress",
        feedback: JSON.stringify(formData),
        answers: answers
      }),
    }).catch(err => {
      console.error("Auto-save failed:", err);
    });

  }, 1000); // หน่วง 1 วิหลังเปลี่ยน

  return () => clearTimeout(timeout); // ยกเลิกถ้ายังพิมพ์อยู่
  
}, [formData]);

useEffect(() => {
  if (justSubmitted) {
    const timer = setTimeout(() => {
      setJustSubmitted(false);
    }, 3000);
    return () => clearTimeout(timer);
  }
}, [justSubmitted]);


  useEffect(() => {
    if (questions.length === 0) return;

    fetch("https://three60-feedback-tracking.onrender.com/api/evaluation_relations")
      .then(res => res.json())
      .then(data => {
        const existing = data.find(e =>
          e.evaluatee_id === id &&
          e.evaluator_id === evaluatorId &&
          e.team_name === teamName &&
          e.relationship_role === userRole
        );
        if (existing) {
          setEvaluateeInfo({ fullName: existing.evaluatee_name, Role: existing.relationship_role });
          setEvaluatorId(existing.evaluator_id);
          setTeamName(existing.team_name);
          setUserRole(existing.relationship_role);
          setCurrentStatus(existing.status);
          setHasLoadedStatus(true);
          const feedbackRaw = existing.feedback;
          let partialForm = {};

          try {
            const feedback = JSON.parse(feedbackRaw);
            partialForm.performanceComments = feedback.performanceComments || { contribution: "", innovation: "", team: "" };
            partialForm.strengths = feedback.strengths || "";
            partialForm.developments = feedback.developments || "";
          } catch (e) {
            partialForm.performanceComments = { contribution: "", innovation: "", team: "" };
            partialForm.strengths = "";
            partialForm.developments = "";
          }

          // ดึงคำตอบจริงจากตาราง answers
          fetch(`https://three60-feedback-tracking.onrender.com/api/answers?evaluator_id=${evaluatorId}&evaluatee_id=${evaluateeId}&team_name=${encodeURIComponent(teamName)}&relationship_role=${encodeURIComponent(userRole)}`)
            .then(res => res.json())
            .then(answers => {
              const mergedForm = { ...partialForm };

              questions.forEach(q => {
                const section = q.core_value;
                if (!mergedForm[section]) mergedForm[section] = {};
                const ans = answers.find(a => a.question_id === q.id);
                const isSkipped = ans?.answer_text === "n" && ans?.score === null;

                if (!isSkipped && (ans?.score !== null || (ans?.answer_text && ans.answer_text !== "n"))) {
                  mergedForm[section][q.id] = ans?.score ?? ans?.answer_text;
                }
              });

              setFormData(mergedForm);
              setInitialFormData(JSON.parse(JSON.stringify(mergedForm))); // clone เก็บไว้เปรียบเทียบ
            });
        }
      });
  }, [id, questions]);

  const isFormChanged = () => {
    return JSON.stringify(formData) !== JSON.stringify(initialFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allSections = ['core', 'operational', 'performance', 'overall'];
    console.log("formData ที่ใช้ตอน submit", formData);
    for (const section of allSections) {
      const sectionData = formData[section] || {};
       for (const [id, value] of Object.entries(sectionData)) {
        // "n" = ผ่านได้ (ถือว่า skip อย่างถูกต้อง)
        const isSkipped = value === "n";
        const isEmpty = value === "" || value === undefined || value === null;
        if (isEmpty && !isSkipped) {
          alert("กรุณากรอกข้อมูลให้ครบถ้วนก่อนส่ง");
          scrollToQuestion(section, id);
          return;
        }
      }
    }

    const requiredTextIds = {
    performance: [16, 17, 18],
    overall: [19, 20],
  };

  for (const [section, ids] of Object.entries(requiredTextIds)) {
    const sectionData = formData[section] || {};
    for (const id of ids) {
      const val = sectionData[id]?.toString().trim();
      if (!val) {
        alert("กรุณากรอกข้อมูลข้อความให้ครบถ้วน");
        scrollToQuestion(section, id);
        return;
      }
    }
  }

    // 🧠 สร้าง answers จาก formData
    const answers = [];
    allSections.forEach(section => {
      const sectionData = formData[section] || {};
      Object.entries(sectionData).forEach(([qid, val]) => {
        if (!isNaN(val) && val !== "" && val !== undefined && val !== null) {
          answers.push({ question_id: parseInt(qid), score: parseInt(val), answer_text: null });
        } else if (val === "n") {
          answers.push({ question_id: parseInt(qid), score: null, answer_text: "n" }); // กรณี skip
        } else {
          answers.push({ question_id: parseInt(qid), score: null, answer_text: val });
        }
      });
    });

   setJustSubmitted(true);
    await saveEvaluation(formData, "Completed");
    setCurrentStatus("Completed");

    alert("ส่งแบบฟอร์มเรียบร้อย");
    navigate("/userhome");
  };

  const renderQuestions = (questionsList, sectionKey) => (
    questionsList
      .filter(q => q.core_value === sectionKey)
      .map((question) => {
        const id = question.id.toString(); // ต้องเป็น string เพื่อให้ใช้กับ formData
        const value = formData?.[sectionKey]?.[id] ?? (question.question_type === "text" ? "" : undefined);

        return (
          <div
            key={id}
            className="question-block"
            ref={(el) => {
              if (el) questionRefs.current[`${sectionKey}-${id}`] = el;
            }}
          >
            <label className="question-label">{question.question_text}</label>
            {(() => {
              const mapKey = {
                "COMPASSION (เห็นอกเห็นใจกัน)": "compassion",
                "CREDIBILITY (เชื่อถือได้)": "credibility",
                "CO-CREATION (ร่วมกันสร้างสรรค์และเรียนรู้)": "co_creation",
                "COURAGE (กล้าคิดกล้าทำ)": "courage",
                "Productivity Based": "productivity",
                "High Quality Products & Services": "high_quality",
                "Dynamic & Agile": "dynamic_agile",
                "Open, Transparent, & Collaboration": "open_transparent",
                "Customer-Centric / Market-Driven": "customer_centric",
                "Data Driven": "data_driven",
                "Innovation": "innovation",
                "Empowerment": "empowerment",
                "Contribution to the Organization (การสร้างคุณค่าให้กับองค์กร)": "contribution_org",
                "Innovation for the Organization (สร้างสรรค์สิ่งใหม่เพื่อองค์กร)": "innovation_org",
                "Contribution to Team (การสร้างคุณค่าให้กับทีม)": "contribution_team_org",
                "Supporting details for the Contribution to the Organization": "contribution_org2",
                "Supporting details for the Innovation for the Organization": "innovation_org2",
                "Supporting details for the Contribution to Team": "contribution_team_org2"
              };
              const descKey = mapKey[question.question_text];
              return descKey && questionDescriptions[descKey] ? (
                <div className="question-description">{questionDescriptions[descKey]}</div>
              ) : null;
            })()}

            {question.question_type === "text" ? (
              <textarea
                className="text-area"
                placeholder="กรอกความคิดเห็นของคุณที่นี่"
                value={value}
                onChange={(e) => {
                  setHasStartedTyping(true);
                  const newValue = e.target.value;
                  const updated = {
                    ...formData,
                    [sectionKey]: {
                      ...formData[sectionKey],
                      [id]: newValue,
                    },
                  };
                  setFormData(updated);
                  if (!justSubmitted) {
                    saveEvaluation(updated, "In Progress");
                  }
                }}

                style={{ width: "100%", minHeight: "80px", marginTop: "10px", backgroundColor: "#eef5ff" }}
              />
            ) : (
              <div className="score-radio-group" style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                {scoreOptions.map((opt) => (
                  <div key={opt.value} style={{ textAlign: "center", flex: 1 }}>
                    <div className="score-label">{opt.label}</div>
                    <label className="score-option">
                      <input
                        type="radio"
                        name={`question-${id}`}
                        value={opt.value}
                        checked={value === opt.value}
                        onChange={(e) => {
                          setHasStartedTyping(true);
                          const newValue = parseInt(e.target.value);
                          const updated = {
                            ...formData,
                            [sectionKey]: {
                              ...formData[sectionKey],
                              [id]: newValue,
                            },
                          };
                          setFormData(updated);
                          if (!justSubmitted) {
                            saveEvaluation(updated, "In Progress");
                          }
                        }}
                      />
                      <div className="score-circle"></div>
                      <div className="score-value">{opt.value}</div>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })
  );


  const saveEvaluation = async (formDataParam = formData, overrideStatus = null) => {
    if (!formDataParam || !evaluatorId || !id || !teamName || !userRole || !hasLoadedStatus) return;

    if (justSubmitted && overrideStatus !== "Completed") return;

    const allSections = ['core', 'operational', 'performance', 'overall'];
    const answers = [];
    allSections.forEach(section => {
      const sectionData = formDataParam[section] || {};
      Object.entries(sectionData).forEach(([qid, val]) => {
        if (!isNaN(val) && val !== "" && val !== undefined && val !== null) {
          answers.push({ question_id: parseInt(qid), score: parseInt(val), answer_text: null });
        } else {
          answers.push({ question_id: parseInt(qid), score: null, answer_text: val });
        }
      });
    });

    const statusToUse = overrideStatus || currentStatus;
    console.log("📦 saveEvaluation called with status:", statusToUse);

      return await fetch("https://three60-feedback-tracking.onrender.com/api/evaluation_relations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          evaluator_id: evaluatorId,
          evaluatee_id: id,
          relationship_role: userRole,
          team_name: teamName,
          status: statusToUse, // ใช้สถานะที่ส่งมา
          feedback: JSON.stringify(formDataParam),
          answers: answers
        }),
      });
    };

  return (
    <div className="form-container">
      <div className="header">
        <div className="header-left">
          <button type="button" className="btn-back-header" onClick={() => {
            if (isFormChanged() && currentStatus === "Completed") {
              setShowWarning(true); // แสดง popup แค่ตอนแก้ไข (edit)
            } else {
              navigate("/userhome"); // กรอกครั้งแรกหรือยังไม่ส่ง → ออกได้เลย
            }
          }} aria-label="ย้อนกลับ">
            <FiArrowLeft size={24} />
          </button>

          TAOKAE Project 360 Degree Feedback
        </div>
        <div className="header-right">
          {evaluateeInfo ? (
            <div className="evaluatee-desktop">
              <div className="label">
                {evaluatorId === id ? "ประเมินตัวเอง:" : "ผู้ถูกประเมิน:"}
              </div>
              <div className="name">{evaluateeInfo["Full Name"]}</div>
              <div className="role">{evaluateeInfo.Role}</div>
            </div>
          ) : <div>Loading...</div>}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <h4>Section 1: 4C Core Values</h4>
        {renderQuestions(questions, "core")}

        <h4>Section 2: Operational Values</h4>
        {renderQuestions(questions, "operational")}

        <h4>Section 3: True Performance</h4>
        {renderQuestions(questions, "performance")}

        <h4>Section 4: Overall Performance</h4>
        {renderQuestions(questions, "overall")}

        <div className="form-buttons">
          <button type="submit" className="btn-submit">Submit</button>
        </div>

      </form>
      {showWarning && (
      <div className="confirm-evaluate-overlay">
        <div className="confirm-evaluate-modal">
          <p>หากมีการเปลี่ยนแปลงการประเมิน กรุณากดส่งอีกครั้ง</p>
          <div className="confirm-evaluate-buttons">
            <button className="btn-no" onClick={() => setShowWarning(false)}>รับทราบ</button>
            <button
              className="btn-yes"
              onClick={() => {
                setShowWarning(false);
                saveEvaluation(initialFormData, "Completed");
                navigate("/userhome");
              }}
            >
              ไม่เปลี่ยนแปลงคะแนน
            </button>

          </div>
        </div>
      </div>
    )}

    </div>
  );
}
