import { useMemo, useState } from "react";

const programs = ["Elementary", "Middle School", "High School"];

const benefits = [
  {
    title: "Top U.S. University Mentors",
    copy: "Carefully selected mentors from leading universities across the U.S.",
    icon: "university"
  },
  {
    title: "Freedom to Choose",
    copy: "Choose by university, school district, subject, and teaching style",
    icon: "choice"
  },
  {
    title: "Designed for Your Child",
    copy: "Lessons tailored to your child's grade, pace, and learning needs",
    icon: "student"
  },
  {
    title: "Clear & Family-Friendly Experience",
    copy: "Direct communication with mentors, along with guidance and free learning resources",
    icon: "message"
  }
];

const processSteps = [
  {
    title: "Conversation",
    copy: "We start with a conversation to understand your child's academic goals, learning style, personality, and preferences.",
    icon: "chat"
  },
  {
    title: "Handpick Mentors",
    copy: "Based on your needs, we carefully handpick 3 university mentors who are the best fit for your child.",
    icon: "people"
  },
  {
    title: "Meet & Choose",
    copy: "You review the mentors, meet with them, and choose the one your child connects with most.",
    icon: "clipboard"
  },
  {
    title: "Ongoing Support",
    copy: "We continuously monitor the match and learning experience, making adjustments as needed until you are 100% satisfied.",
    icon: "growth"
  }
];

const mentors = [
  {
    image: "/teachers/mentor-alex.jpg",
    label: "Math & Science Mentor",
    campus: "UCLA / UCI network",
    subjects: ["Math", "Physics", "Calculus", "SAT"],
    points: ["Step-by-step explanations", "Weekly progress notes", "Patient academic coaching"]
  },
  {
    image: "/teachers/mentor-emily.jpg",
    label: "Writing & Planning Mentor",
    campus: "Top university mentor",
    subjects: ["English", "Writing", "Study Skills", "ACT"],
    points: ["Essay and reading support", "Clear family communication", "Confidence-building guidance"]
  }
];

const initialForm = {
  parentName: "",
  email: "",
  studentGrade: "",
  supportArea: "Math",
  notes: ""
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [submitState, setSubmitState] = useState({ status: "idle", message: "" });

  const canSubmit = useMemo(
    () => form.parentName.trim() && form.email.trim() && form.studentGrade.trim(),
    [form]
  );

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const openConsultation = () => {
    setSubmitState({ status: "idle", message: "" });
    setModalOpen(true);
    setMenuOpen(false);
  };

  const submitConsultation = async (event) => {
    event.preventDefault();
    if (!canSubmit || submitState.status === "loading") {
      return;
    }

    setSubmitState({ status: "loading", message: "Sending your request..." });

    try {
      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || "Unable to send request.");
      }

      setSubmitState({
        status: "success",
        message: "Request received. EduBridge will follow up with next steps."
      });
      setForm(initialForm);
    } catch (error) {
      const fallback = {
        ...form,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem("edubridge-consultation-draft", JSON.stringify(fallback));
      setSubmitState({
        status: "error",
        message: "The API is not running, so this draft was saved in your browser."
      });
    }
  };

  return (
    <>
      <header className="site-header">
        <nav className="nav-shell" aria-label="Main navigation">
          <div className="nav-left" aria-label="Primary">
            <div className="program-menu">
              <button className="nav-link nav-menu-button" type="button" aria-haspopup="true">
                Program
                <ChevronDown />
              </button>
              <div className="program-dropdown" aria-label="Program levels">
                {programs.map((program) => (
                  <a href="#programs" key={program}>
                    {program}
                  </a>
                ))}
              </div>
            </div>
            <a className="nav-link" href="#resources">
              Resources
            </a>
            <a className="nav-link" href="#resources">
              Blog
            </a>
          </div>

          <a className="brand" href="#top" aria-label="EduBridge home">
            <BridgeLogo />
          </a>

          <div className="nav-right">
            <button className="consult-button consult-button-dark" type="button" onClick={openConsultation}>
              BOOK A CONSULTATION
            </button>
            <button
              className="mobile-menu-button"
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </nav>

        <div className={`mobile-menu ${menuOpen ? "mobile-menu-open" : ""}`}>
          <a href="#programs" onClick={() => setMenuOpen(false)}>
            Program
          </a>
          <a href="#resources" onClick={() => setMenuOpen(false)}>
            Resources
          </a>
          <a href="#resources" onClick={() => setMenuOpen(false)}>
            Blog
          </a>
          <button type="button" onClick={openConsultation}>
            BOOK A CONSULTATION
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="page-grid hero-grid">
            <div className="hero-copy">
              <h1>Trusted Mentors for Local 1-on-1 Academic Support</h1>
              <p className="hero-intro">
                Feeling unsure how to support your child's academic path? Want someone who truly
                understands what students go through today? Let an university mentor who has been
                through the same journey support your child with weekly academic help and clear
                guidance to keep them on track.
              </p>
              <blockquote>
                "Find a trusted local UCLA/UCI mentor who can tutor 1-on-1 and guide your child like
                an older sibling."
              </blockquote>
              <button className="consult-button consult-button-dark hero-cta" type="button" onClick={openConsultation}>
                MEET OUR TEAM
              </button>
            </div>

            <div className="hero-media" aria-label="EduBridge tutoring scenes">
              <figure className="hero-image hero-image-top">
                <img src="/hero/mentor-math.png" alt="University mentor helping a student with math" />
              </figure>
              <figure className="hero-image hero-image-bottom">
                <img src="/hero/mentor-writing.png" alt="University mentor guiding a student through writing" />
              </figure>
            </div>
          </div>
        </section>

        <section className="value-section" id="resources">
          <div className="section-heading">
            <h2>Beyond Tutoring: Mentorship That Matters</h2>
          </div>
          <div className="value-field">
            <div className="value-map page-grid" aria-label="EduBridge mentorship benefits">
              <div className="value-card value-card-left-top">
                <Icon name={benefits[0].icon} />
                <h3>{benefits[0].title}</h3>
                <p>{benefits[0].copy}</p>
              </div>
              <div className="value-card value-card-left-bottom">
                <Icon name={benefits[1].icon} />
                <h3>{benefits[1].title}</h3>
                <p>{benefits[1].copy}</p>
              </div>
              <div className="value-hub">
                <BridgeMark />
                <h3>EduBridge</h3>
                <p>Mentorship, Not Just Tutoring</p>
                <span>For Every Child</span>
              </div>
              <div className="value-card value-card-right-top">
                <Icon name={benefits[2].icon} />
                <h3>{benefits[2].title}</h3>
                <p>{benefits[2].copy}</p>
              </div>
              <div className="value-card value-card-right-bottom">
                <Icon name={benefits[3].icon} />
                <h3>{benefits[3].title}</h3>
                <p>{benefits[3].copy}</p>
              </div>
              <svg className="connection-lines" viewBox="0 0 1100 520" aria-hidden="true">
                <path d="M310 130 C430 160 450 190 520 240" />
                <path d="M310 390 C430 350 450 325 520 285" />
                <path d="M790 130 C670 160 650 190 580 240" />
                <path d="M790 390 C670 350 650 325 580 285" />
              </svg>
            </div>
          </div>
          <div className="learn-more-row">
            <a className="learn-more-button" href="#process">
              Learn More
            </a>
          </div>
        </section>

        <section className="process-section" id="process">
          <div className="section-heading compact-heading">
            <p>OUR PROCESS</p>
            <h2>A Simple 4-Step Path to the Right Match</h2>
          </div>
          <div className="process-grid page-grid">
            {processSteps.map((step, index) => (
              <article className="process-card" key={step.title}>
                <div className="step-number">{index + 1}</div>
                <Icon name={step.icon} />
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mentor-section" id="programs">
          <div className="section-heading compact-heading">
            <p>MEET OUR UNIVERSITY MENTORS</p>
            <h2>Top University Students, Dedicated to Your Child's Success</h2>
          </div>
          <div className="mentor-grid page-grid">
            {mentors.map((mentor) => (
              <article className="mentor-card" key={mentor.label}>
                <img src={mentor.image} alt={`${mentor.label} portrait`} />
                <div className="mentor-content">
                  <div className="mentor-title-row">
                    <h3>{mentor.label}</h3>
                    <span>University Mentor</span>
                  </div>
                  <p className="campus-line">
                    <Icon name="university" />
                    {mentor.campus}
                  </p>
                  <div className="subject-list" aria-label={`${mentor.label} subjects`}>
                    {mentor.subjects.map((subject) => (
                      <span key={subject}>{subject}</span>
                    ))}
                  </div>
                  <ul>
                    {mentor.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <div className="mentor-actions">
                    <button type="button" onClick={openConsultation}>
                      Book a Meeting
                    </button>
                    <a href="mailto:edubridge622@gmail.com">Contact</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="satisfaction-section">
          <div className="satisfaction-banner page-grid">
            <div className="shield-icon" aria-hidden="true">
              <Icon name="shield" />
            </div>
            <div>
              <h2>Your Satisfaction is Our Priority</h2>
              <p>
                If the match isn't right, we'll find better. We keep improving the match and the
                experience until you and your child are completely happy.
              </p>
            </div>
            <div className="guarantee-stamp" aria-label="100 percent satisfaction guaranteed">
              <span>100%</span>
              <small>Guaranteed</small>
            </div>
          </div>
        </section>
      </main>

      <Footer openConsultation={openConsultation} />

      {modalOpen && (
        <ConsultationModal
          canSubmit={Boolean(canSubmit)}
          form={form}
          submitState={submitState}
          onChange={updateField}
          onClose={() => setModalOpen(false)}
          onSubmit={submitConsultation}
        />
      )}
    </>
  );
}

function Footer({ openConsultation }) {
  return (
    <footer className="site-footer">
      <div className="footer-grid page-grid">
        <div className="footer-brand">
          <BridgeLogo compact />
          <p>Top university mentors. Personalized support. Stronger futures.</p>
        </div>
        <div>
          <h2>About Us</h2>
          <a href="#top">Edubridge</a>
          <a href="#resources">FAQ</a>
        </div>
        <div>
          <h2>Program</h2>
          {programs.map((program) => (
            <a href="#programs" key={program}>
              {program}
            </a>
          ))}
        </div>
        <div>
          <h2>Contact Us</h2>
          <a href="mailto:edubridge622@gmail.com">edubridge622@gmail.com</a>
          <a href="tel:+19492934691">(949) 293 - 4691</a>
        </div>
        <div>
          <h2>Become a Tutor</h2>
          <p>
            Please contact us at the number listed below to learn more. All tutors must have a valid
            Social Security Number and be legally authorized to work in the United States.
          </p>
          <button type="button" onClick={openConsultation}>
            Apply Now
          </button>
        </div>
      </div>
    </footer>
  );
}

function ConsultationModal({ canSubmit, form, submitState, onChange, onClose, onSubmit }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="consultation-modal" role="dialog" aria-modal="true" aria-labelledby="consult-title">
        <button className="modal-close" type="button" aria-label="Close consultation form" onClick={onClose}>
          <CloseIcon />
        </button>
        <div className="modal-header">
          <h2 id="consult-title">Plan your first EduBridge match</h2>
          <p>Tell us what your child needs. We will use this to recommend a first mentor shortlist.</p>
        </div>
        <form onSubmit={onSubmit}>
          <label>
            Parent name
            <input name="parentName" value={form.parentName} onChange={onChange} autoComplete="name" required />
          </label>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={onChange} autoComplete="email" required />
          </label>
          <label>
            Student grade
            <input name="studentGrade" value={form.studentGrade} onChange={onChange} placeholder="Example: 8th grade" required />
          </label>
          <label>
            Support area
            <select name="supportArea" value={form.supportArea} onChange={onChange}>
              <option>Math</option>
              <option>Science</option>
              <option>English / Writing</option>
              <option>Study planning</option>
              <option>Test prep</option>
            </select>
          </label>
          <label className="full-field">
            What would you like help with?
            <textarea name="notes" value={form.notes} onChange={onChange} rows="4" />
          </label>
          <button className="consult-button consult-button-orange full-field" type="submit" disabled={!canSubmit || submitState.status === "loading"}>
            {submitState.status === "loading" ? "SENDING..." : "SEND REQUEST"}
          </button>
          {submitState.message && <p className={`form-status form-status-${submitState.status}`}>{submitState.message}</p>}
        </form>
      </section>
    </div>
  );
}

function BridgeLogo({ compact = false }) {
  return (
    <span className={`logo-lockup ${compact ? "logo-lockup-compact" : ""}`}>
      <BridgeMark />
      <span>EduBridge</span>
    </span>
  );
}

function BridgeMark() {
  return (
    <svg className="bridge-mark" viewBox="0 0 140 94" role="img" aria-label="EduBridge mark">
      <path className="mark-cap" d="M70 3 124 23 70 43 16 23 70 3Z" />
      <path className="mark-tassel" d="M111 28v22m0 0 8 13m-8-13-8 13" />
      <path className="mark-deck" d="M24 70h92" />
      <path className="mark-span" d="M32 69c17-25 59-25 76 0" />
      <path className="mark-cable" d="M44 68V31m52 37V31M53 62V43m34 19V43" />
      <path className="mark-rail" d="M42 51c19-12 37-12 56 0" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="m5 7 5 5 5-5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function Icon({ name }) {
  const paths = {
    university: (
      <>
        <path d="M4 10 20 4l16 6" />
        <path d="M8 14h24M10 30h20M12 14v14M20 14v14M28 14v14" />
      </>
    ),
    choice: (
      <>
        <circle cx="17" cy="17" r="10" />
        <path d="m24 24 9 9M15 17l3 3 6-8" />
      </>
    ),
    student: (
      <>
        <circle cx="20" cy="11" r="6" />
        <path d="M8 34c2-8 8-12 12-12s10 4 12 12" />
        <path d="M10 28h20" />
      </>
    ),
    message: (
      <>
        <path d="M7 8h26v17H17l-8 7v-7H7z" />
        <path d="M14 16h.1M20 16h.1M26 16h.1" />
      </>
    ),
    chat: (
      <>
        <path d="M6 10h20v13H15l-7 6v-6H6z" />
        <path d="M24 14h10v14h-6l-5 5v-5h-5" />
      </>
    ),
    people: (
      <>
        <circle cx="14" cy="13" r="5" />
        <circle cx="28" cy="13" r="5" />
        <path d="M4 34c2-8 8-12 14-12s12 4 14 12M20 34c1-5 5-9 10-10" />
      </>
    ),
    clipboard: (
      <>
        <path d="M12 8h16v26H12z" />
        <path d="M16 8c0-3 2-5 4-5s4 2 4 5M16 17h8M16 24h8" />
      </>
    ),
    growth: (
      <>
        <path d="M8 32V20M20 32V12M32 32V6" />
        <path d="M6 33h30M10 18l9-8 6 5 9-12" />
      </>
    ),
    shield: (
      <>
        <path d="M20 4 34 10v10c0 9-6 15-14 18C12 35 6 29 6 20V10z" />
        <path d="m13 21 5 5 10-12" />
      </>
    )
  };

  return (
    <svg className="ui-icon" viewBox="0 0 40 40" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

export default App;
