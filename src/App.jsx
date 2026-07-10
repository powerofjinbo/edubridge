import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Award,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  ExternalLink,
  GraduationCap,
  HeartHandshake,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserRoundCheck,
  Users,
  X
} from "lucide-react";

const assetPath = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

const consultationUrl = "https://calendly.com/oliverguo6/academic-planning";
const contactEmail = "edubridge622@gmail.com";
const phoneDisplay = "(949) 293-4691";
const phoneHref = "+19492934691";
const tutorApplicationUrl = `mailto:${contactEmail}?subject=${encodeURIComponent("EduBridge Tutor Application")}`;

const programLevels = [
  {
    id: "elementary",
    label: "Elementary",
    grades: "Grades K-5",
    title: "Build strong foundations and confident learning habits.",
    copy: "Warm, patient guidance helps younger students understand core concepts, stay organized, and feel comfortable asking questions.",
    subjects: ["Math", "Reading", "Writing", "Homework support"],
    focus: ["Core skill development", "Positive study routines", "Clear parent updates"]
  },
  {
    id: "middle",
    label: "Middle School",
    grades: "Grades 6-8",
    title: "Turn growing workloads into a plan students can manage.",
    copy: "Mentors combine subject support with practical planning so students can handle multiple classes and become more independent.",
    subjects: ["Pre-algebra", "Science", "English", "Study skills"],
    focus: ["Weekly organization", "Concept mastery", "Confidence and accountability"]
  },
  {
    id: "high",
    label: "High School",
    grades: "Grades 9-12",
    title: "Strengthen coursework while planning the next step.",
    copy: "Students receive focused academic support from mentors who understand advanced classes, testing, and the transition to college.",
    subjects: ["Algebra & Calculus", "Physics", "Essay writing", "SAT / ACT"],
    focus: ["Advanced coursework", "Test preparation", "Academic and college planning"]
  }
];

const benefits = [
  {
    title: "Selected for more than grades",
    copy: "We look for subject strength, communication, reliability, and the ability to connect with a student.",
    icon: Award
  },
  {
    title: "Fit comes first",
    copy: "Your family reviews a tailored shortlist and chooses the mentor who feels right.",
    icon: Target
  },
  {
    title: "One clear point of support",
    copy: "Expect straightforward scheduling, family communication, and help when the match needs adjustment.",
    icon: MessageCircle
  },
  {
    title: "Built around the student",
    copy: "Sessions adapt to grade level, pace, goals, and the way your child learns best.",
    icon: UserRoundCheck
  }
];

const processSteps = [
  {
    title: "Tell us what matters",
    copy: "Share your child's goals, schedule, learning style, and the kind of mentor they respond to.",
    icon: MessageCircle
  },
  {
    title: "Receive a shortlist",
    copy: "We handpick three university mentors based on subject needs, personality, location, and availability.",
    icon: Search
  },
  {
    title: "Meet and choose",
    copy: "Review the profiles, meet your options, and make the final decision as a family.",
    icon: Users
  },
  {
    title: "Grow with support",
    copy: "Begin weekly 1-on-1 sessions with ongoing fit support whenever your needs change.",
    icon: TrendingUp
  }
];

const mentors = [
  {
    image: "/teachers/mentor-alex.jpg",
    title: "STEM Mentor Profile",
    campus: "UCLA / UCI mentor network",
    subjects: ["Math", "Physics", "Calculus", "SAT"],
    strengths: ["Step-by-step explanations", "Patient problem solving", "Weekly progress notes"]
  },
  {
    image: "/teachers/mentor-emily.jpg",
    title: "Writing Mentor Profile",
    campus: "Top university mentor network",
    subjects: ["English", "Writing", "Study Skills", "ACT"],
    strengths: ["Essay and reading support", "Clear family communication", "Confidence-building guidance"]
  }
];

const faqs = [
  {
    question: "How does the mentor matching process work?",
    answer: "After a free consultation, EduBridge uses your child's academic needs, personality, schedule, and preferences to prepare a shortlist of three mentors. Your family reviews the options and chooses the final match."
  },
  {
    question: "Can we meet mentors before choosing one?",
    answer: "Yes. The process is designed to give families a real choice. You can review the shortlisted profiles and discuss the fit before deciding who should work with your child."
  },
  {
    question: "Which grades and subjects do you support?",
    answer: "EduBridge supports elementary, middle, and high school students. Common requests include math, science, English, writing, study skills, and SAT or ACT preparation. Availability is confirmed during the consultation."
  },
  {
    question: "Are sessions online or in person?",
    answer: "Session format depends on location, mentor availability, and family preference. Tell us what works best during the consultation and we will include it in the matching criteria."
  },
  {
    question: "What if the first match is not right?",
    answer: "Tell us what is not working. EduBridge will revisit the fit, recommend an adjustment, or help find another mentor so the student can keep moving forward."
  },
  {
    question: "How can a university student apply to become a mentor?",
    answer: `Email ${contactEmail} with your university, major, subjects, availability, and tutoring or mentoring experience. Applicants must be legally authorized to work in the United States.`
  }
];

const legalContent = {
  privacy: {
    eyebrow: "PRIVACY",
    title: "Privacy notice",
    intro: "EduBridge uses the information families provide only to respond to inquiries, schedule consultations, and recommend suitable academic support.",
    sections: [
      ["Information we receive", "Contact details, student grade level, requested support areas, scheduling preferences, and any notes you choose to share."],
      ["How information is used", "To answer your request, coordinate a consultation, prepare mentor options, and provide ongoing service communication."],
      ["Student information", "Parents and guardians should avoid sending sensitive records through the website. EduBridge does not ask children to submit information directly."],
      ["Your choices", `You may request access, correction, or deletion of inquiry information by emailing ${contactEmail}.`]
    ]
  },
  terms: {
    eyebrow: "TERMS",
    title: "Website terms",
    intro: "By using this website, you agree to use its information and contact tools for lawful inquiries about EduBridge services.",
    sections: [
      ["Service information", "Program descriptions are general and mentor availability, subjects, format, and scheduling are confirmed during consultation."],
      ["Academic outcomes", "Mentoring is intended to support learning and planning. Specific grades, test scores, admissions decisions, or other outcomes are not guaranteed."],
      ["Scheduling and fees", "Any fees, cancellation terms, and session arrangements are provided before a family begins paid services."],
      ["Questions", `Contact ${contactEmail} before using the service if you have questions about these terms.`]
    ]
  }
};

const initialForm = {
  parentName: "",
  email: "",
  studentGrade: "",
  supportArea: "Math",
  notes: "",
  website: "",
  consent: false
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProgram, setActiveProgram] = useState(programLevels[0].id);
  const [openFaq, setOpenFaq] = useState(0);
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [consultMode, setConsultMode] = useState("schedule");
  const [legalType, setLegalType] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [submitState, setSubmitState] = useState({ status: "idle", message: "" });

  const selectedProgram = programLevels.find((program) => program.id === activeProgram) || programLevels[0];
  const apiBase = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
  const canSubmit = useMemo(
    () => form.parentName.trim() && form.email.trim() && form.studentGrade && form.consent,
    [form]
  );

  useEffect(() => {
    document.documentElement.classList.add("reveal-ready");
    const elements = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px" }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const modalOpen = consultationOpen || Boolean(legalType);
    document.body.classList.toggle("modal-open", modalOpen);

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setConsultationOpen(false);
        setLegalType(null);
      }
    };

    if (modalOpen) {
      window.addEventListener("keydown", closeOnEscape);
    }

    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [consultationOpen, legalType]);

  const openConsultation = (mode = "schedule", grade = "") => {
    setConsultMode(mode);
    setSubmitState({ status: "idle", message: "" });
    if (grade) {
      setForm((current) => ({ ...current, studentGrade: grade }));
    }
    setConsultationOpen(true);
    setMenuOpen(false);
  };

  const updateField = (event) => {
    const { checked, name, type, value } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const submitConsultation = async (event) => {
    event.preventDefault();
    if (!canSubmit || submitState.status === "loading") {
      return;
    }

    if (!apiBase) {
      const subject = encodeURIComponent(`EduBridge consultation request - ${form.studentGrade}`);
      const body = encodeURIComponent(
        [
          `Parent / guardian: ${form.parentName}`,
          `Email: ${form.email}`,
          `Student grade: ${form.studentGrade}`,
          `Support area: ${form.supportArea}`,
          "",
          "What we would like help with:",
          form.notes || "Not provided"
        ].join("\n")
      );
      window.location.assign(`mailto:${contactEmail}?subject=${subject}&body=${body}`);
      setSubmitState({ status: "success", message: "Your email app has been opened with the inquiry details." });
      return;
    }

    setSubmitState({ status: "loading", message: "Sending your request..." });

    try {
      const response = await fetch(`${apiBase}/api/consultations`, {
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
      setSubmitState({
        status: "error",
        message: error.message || `Please email ${contactEmail} or book a consultation.`
      });
    }
  };

  return (
    <>
      <header className="site-header">
        <div className="announcement-bar">
          <div className="announcement-inner">
            <span><MapPin aria-hidden="true" /> Serving Orange County families with local and online options</span>
            <a href={`tel:${phoneHref}`}><Phone aria-hidden="true" /> {phoneDisplay}</a>
          </div>
        </div>

        <nav className="nav-shell" aria-label="Main navigation">
          <a className="brand" href="#top" aria-label="EduBridge home">
            <BridgeLogo />
          </a>

          <div className="desktop-nav">
            <a href="#programs">Programs</a>
            <a href="#process">How it works</a>
            <a href="#mentors">Mentors</a>
            <a href="#faq">FAQ</a>
          </div>

          <div className="nav-actions">
            <button className="button button-primary nav-cta" type="button" onClick={() => openConsultation("schedule")}>
              Book consultation <ArrowRight aria-hidden="true" />
            </button>
            <button
              className="mobile-menu-button"
              type="button"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </div>
        </nav>

        <div className={`mobile-menu ${menuOpen ? "mobile-menu-open" : ""}`} aria-hidden={!menuOpen}>
          <a href="#programs" tabIndex={menuOpen ? 0 : -1} onClick={() => setMenuOpen(false)}>Programs</a>
          <a href="#process" tabIndex={menuOpen ? 0 : -1} onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#mentors" tabIndex={menuOpen ? 0 : -1} onClick={() => setMenuOpen(false)}>Mentors</a>
          <a href="#faq" tabIndex={menuOpen ? 0 : -1} onClick={() => setMenuOpen(false)}>FAQ</a>
          <button type="button" tabIndex={menuOpen ? 0 : -1} onClick={() => openConsultation("schedule")}>Book a free consultation</button>
        </div>
      </header>

      <main id="top">
        <section
          className="hero-section"
          style={{ "--hero-image": `url("${assetPath("/hero/mentor-math.webp")}")` }}
        >
          <div className="hero-overlay" aria-hidden="true" />
          <div className="hero-content page-shell">
            <div className="hero-copy">
              <p className="eyebrow hero-eyebrow"><GraduationCap aria-hidden="true" /> University mentors. Thoughtfully matched.</p>
              <h1>1-on-1 academic mentoring, matched to your child.</h1>
              <p className="hero-intro">
                EduBridge connects families with trusted university mentors for weekly academic support,
                practical guidance, and a relationship that feels personal.
              </p>
              <div className="hero-actions">
                <button className="button button-primary button-large" type="button" onClick={() => openConsultation("schedule")}>
                  Book a free consultation <ArrowRight aria-hidden="true" />
                </button>
                <a className="button button-on-dark button-large" href="#process">See how matching works</a>
              </div>
              <ul className="hero-points" aria-label="EduBridge service highlights">
                <li><Check aria-hidden="true" /> You choose the final mentor</li>
                <li><Check aria-hidden="true" /> Weekly 1-on-1 support</li>
                <li><Check aria-hidden="true" /> Ongoing fit guidance</li>
              </ul>
            </div>
            <div className="hero-caption">
              <span>LOCAL MENTOR NETWORK</span>
              <p>UCLA, UCI, and other leading university students</p>
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="Why families choose EduBridge">
          <div className="trust-grid page-shell">
            <div className="trust-intro" data-reveal>
              <span>MENTORSHIP WITH A HUMAN FIT</span>
              <strong>Built for families, not a tutor directory.</strong>
            </div>
            <div className="trust-item" data-reveal>
              <div><Users aria-hidden="true" /></div>
              <p><strong>3 tailored matches</strong><span>Review a focused shortlist, not hundreds of profiles.</span></p>
            </div>
            <div className="trust-item" data-reveal>
              <div><HeartHandshake aria-hidden="true" /></div>
              <p><strong>Family-led choice</strong><span>Meet your options and decide who feels right.</span></p>
            </div>
            <div className="trust-item" data-reveal>
              <div><ShieldCheck aria-hidden="true" /></div>
              <p><strong>Fit support</strong><span>We help adjust or rematch when needs change.</span></p>
            </div>
          </div>
        </section>

        <section className="section programs-section" id="programs">
          <div className="page-shell">
            <SectionHeading
              eyebrow="SUPPORT BY SCHOOL STAGE"
              title="The right kind of help changes as students grow."
              copy="Choose a school stage to see how mentoring adapts to the academic work and independence your child needs now."
            />

            <div className="program-tabs" role="tablist" aria-label="School stages" data-reveal>
              {programLevels.map((program) => (
                <button
                  key={program.id}
                  id={`tab-${program.id}`}
                  type="button"
                  role="tab"
                  aria-selected={activeProgram === program.id}
                  aria-controls={`panel-${program.id}`}
                  tabIndex={activeProgram === program.id ? 0 : -1}
                  className={activeProgram === program.id ? "active" : ""}
                  onClick={() => setActiveProgram(program.id)}
                >
                  <span>{program.label}</span>
                  <small>{program.grades}</small>
                </button>
              ))}
            </div>

            <div
              className="program-panel"
              id={`panel-${selectedProgram.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${selectedProgram.id}`}
              key={selectedProgram.id}
            >
              <div className="program-copy">
                <p className="panel-kicker"><BookOpen aria-hidden="true" /> {selectedProgram.grades}</p>
                <h3>{selectedProgram.title}</h3>
                <p>{selectedProgram.copy}</p>
                <div className="subject-list" aria-label="Common support areas">
                  {selectedProgram.subjects.map((subject) => <span key={subject}>{subject}</span>)}
                </div>
                <button
                  className="button button-primary"
                  type="button"
                  onClick={() => openConsultation("message", selectedProgram.grades)}
                >
                  Find {selectedProgram.id === "elementary" ? "an" : "a"} {selectedProgram.label.toLowerCase()} mentor <ArrowRight aria-hidden="true" />
                </button>
              </div>

              <div className="program-visual">
                <img
                  src={assetPath("/hero/mentor-writing.webp")}
                  alt="University mentor reviewing schoolwork with a student"
                  loading="lazy"
                  width="1672"
                  height="941"
                />
                <div className="program-focus">
                  <span>WHAT WE FOCUS ON</span>
                  <ul>
                    {selectedProgram.focus.map((item) => <li key={item}><CheckCircle2 aria-hidden="true" /> {item}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section benefits-section" id="why-edubridge">
          <div className="page-shell">
            <SectionHeading
              eyebrow="WHY EDUBRIDGE"
              title="More personal than a platform. More complete than tutoring alone."
              copy="A strong academic match considers the student, the mentor, and the family experience around every session."
              align="left"
            />
            <div className="benefit-grid">
              {benefits.map(({ title, copy, icon: BenefitIcon }, index) => (
                <article className="benefit-card" key={title} data-reveal style={{ "--delay": `${index * 70}ms` }}>
                  <div className="icon-box"><BenefitIcon aria-hidden="true" /></div>
                  <span>0{index + 1}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section process-section" id="process">
          <div className="page-shell">
            <SectionHeading
              eyebrow="HOW MATCHING WORKS"
              title="From first conversation to the right weekly rhythm."
              copy="Four clear steps keep the process focused, transparent, and easy for families to navigate."
            />
            <div className="process-track">
              {processSteps.map(({ title, copy, icon: StepIcon }, index) => (
                <article className="process-step" key={title} data-reveal style={{ "--delay": `${index * 80}ms` }}>
                  <div className="step-top">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <StepIcon aria-hidden="true" />
                  </div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
            <div className="process-cta" data-reveal>
              <p><Clock3 aria-hidden="true" /> Start with a free 30-minute conversation.</p>
              <button className="text-link" type="button" onClick={() => openConsultation("schedule")}>
                Choose a time <ArrowRight aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>

        <section className="section mentor-section" id="mentors">
          <div className="page-shell">
            <SectionHeading
              eyebrow="MEET THE MENTOR NETWORK"
              title="Subject knowledge matters. So does the person explaining it."
              copy="Mentor profiles are chosen around the communication style, subject strengths, and support your student needs."
              align="left"
            />
            <div className="mentor-grid">
              {mentors.map((mentor, index) => (
                <article className="mentor-card" key={mentor.title} data-reveal style={{ "--delay": `${index * 100}ms` }}>
                  <div className="mentor-photo">
                    <img src={assetPath(mentor.image)} alt={`${mentor.title} portrait`} loading="lazy" />
                    <span><Sparkles aria-hidden="true" /> Mentor profile</span>
                  </div>
                  <div className="mentor-content">
                    <p className="mentor-campus"><GraduationCap aria-hidden="true" /> {mentor.campus}</p>
                    <h3>{mentor.title}</h3>
                    <div className="subject-list" aria-label={`${mentor.title} subjects`}>
                      {mentor.subjects.map((subject) => <span key={subject}>{subject}</span>)}
                    </div>
                    <ul>
                      {mentor.strengths.map((strength) => <li key={strength}><Check aria-hidden="true" /> {strength}</li>)}
                    </ul>
                    <div className="mentor-actions">
                      <button className="button button-primary" type="button" onClick={() => openConsultation("schedule")}>
                        Explore a match <ArrowRight aria-hidden="true" />
                      </button>
                      <a className="button button-secondary" href={`mailto:${contactEmail}`}><Mail aria-hidden="true" /> Email us</a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="selection-note" data-reveal>
              <ShieldCheck aria-hidden="true" />
              <p><strong>Every recommendation starts with fit.</strong> We consider subject strength, communication, reliability, schedule, and the student's preferences before a profile reaches your family.</p>
            </div>
          </div>
        </section>

        <section className="fit-section">
          <div className="fit-inner page-shell" data-reveal>
            <div className="fit-icon"><HeartHandshake aria-hidden="true" /></div>
            <div>
              <p className="eyebrow">OUR FIT PROMISE</p>
              <h2>If the match is not right, we help make it right.</h2>
              <p>Needs change. Personalities differ. EduBridge stays involved to adjust the plan or help your family find a better mentor fit.</p>
            </div>
            <button className="button button-dark" type="button" onClick={() => openConsultation("schedule")}>
              Talk with our team <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </section>

        <section className="section faq-section" id="faq">
          <div className="faq-layout page-shell">
            <div className="faq-intro" data-reveal>
              <p className="eyebrow">FREQUENTLY ASKED QUESTIONS</p>
              <h2>Clear answers before you make a decision.</h2>
              <p>Still deciding what kind of support fits? Start with a no-pressure conversation about your child's needs.</p>
              <button className="button button-secondary" type="button" onClick={() => openConsultation("message")}>
                Ask a question <MessageCircle aria-hidden="true" />
              </button>
            </div>
            <div className="faq-list">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <article className={`faq-item ${isOpen ? "faq-open" : ""}`} key={faq.question} data-reveal>
                    <h3>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`faq-answer-${index}`}
                        onClick={() => setOpenFaq(isOpen ? -1 : index)}
                      >
                        <span>{faq.question}</span>
                        {isOpen ? <Minus aria-hidden="true" /> : <Plus aria-hidden="true" />}
                      </button>
                    </h3>
                    <div className="faq-answer" id={`faq-answer-${index}`} hidden={!isOpen}>
                      <p>{faq.answer}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="final-cta-section">
          <div className="final-cta page-shell" data-reveal>
            <div>
              <p className="eyebrow">READY WHEN YOUR FAMILY IS</p>
              <h2>Meet the mentor your child can learn from and look up to.</h2>
            </div>
            <div className="final-cta-actions">
              <button className="button button-primary button-large" type="button" onClick={() => openConsultation("schedule")}>
                Book a free consultation <CalendarDays aria-hidden="true" />
              </button>
              <a href={`tel:${phoneHref}`}><Phone aria-hidden="true" /> {phoneDisplay}</a>
            </div>
          </div>
        </section>
      </main>

      <Footer
        onConsult={() => openConsultation("schedule")}
        onLegal={setLegalType}
      />

      {consultationOpen && (
        <ConsultationModal
          apiEnabled={Boolean(apiBase)}
          canSubmit={Boolean(canSubmit)}
          form={form}
          mode={consultMode}
          submitState={submitState}
          onChange={updateField}
          onClose={() => setConsultationOpen(false)}
          onModeChange={(mode) => {
            setConsultMode(mode);
            setSubmitState({ status: "idle", message: "" });
          }}
          onSubmit={submitConsultation}
        />
      )}

      {legalType && <LegalModal type={legalType} onClose={() => setLegalType(null)} />}
    </>
  );
}

function SectionHeading({ align = "center", copy, eyebrow, title }) {
  return (
    <div className={`section-heading section-heading-${align}`} data-reveal>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p className="section-copy">{copy}</p>
    </div>
  );
}

function Footer({ onConsult, onLegal }) {
  return (
    <footer className="site-footer">
      <div className="footer-main page-shell">
        <div className="footer-brand">
          <a href="#top" aria-label="EduBridge home"><BridgeLogo /></a>
          <p>Thoughtful university mentor matching for personalized 1-on-1 academic support.</p>
          <div className="footer-contact">
            <a href={`mailto:${contactEmail}`}><Mail aria-hidden="true" /> {contactEmail}</a>
            <a href={`tel:${phoneHref}`}><Phone aria-hidden="true" /> {phoneDisplay}</a>
          </div>
        </div>
        <div className="footer-column">
          <h2>Explore</h2>
          <a href="#programs">Programs</a>
          <a href="#process">How it works</a>
          <a href="#mentors">Mentors</a>
          <a href="#faq">FAQ</a>
        </div>
        <div className="footer-column">
          <h2>Programs</h2>
          {programLevels.map((program) => <a href="#programs" key={program.id}>{program.label}</a>)}
        </div>
        <div className="footer-column footer-action-column">
          <h2>Start a conversation</h2>
          <p>Tell us what your child needs and we will explain the matching options.</p>
          <button className="text-link" type="button" onClick={onConsult}>Book a consultation <ArrowRight aria-hidden="true" /></button>
          <a className="text-link" href={tutorApplicationUrl}>Apply to mentor <ExternalLink aria-hidden="true" /></a>
        </div>
      </div>
      <div className="footer-bottom page-shell">
        <p>&copy; {new Date().getFullYear()} EduBridge. All rights reserved.</p>
        <p>Serving Orange County, California</p>
        <div>
          <button type="button" onClick={() => onLegal("privacy")}>Privacy</button>
          <button type="button" onClick={() => onLegal("terms")}>Terms</button>
        </div>
      </div>
    </footer>
  );
}

function ConsultationModal({ apiEnabled, canSubmit, form, mode, onChange, onClose, onModeChange, onSubmit, submitState }) {
  const closeButton = useRef(null);

  useEffect(() => {
    closeButton.current?.focus();
  }, []);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="consultation-modal" role="dialog" aria-modal="true" aria-labelledby="consult-title">
        <button ref={closeButton} className="modal-close" type="button" aria-label="Close consultation dialog" onClick={onClose}>
          <X aria-hidden="true" />
        </button>
        <div className="modal-header">
          <p className="eyebrow">FREE FIRST CONVERSATION</p>
          <h2 id="consult-title">Start your EduBridge match.</h2>
          <p>Choose a time now or send your family's needs so our team can follow up.</p>
        </div>

        <div className="modal-tabs" role="tablist" aria-label="Contact options">
          <button type="button" role="tab" aria-selected={mode === "schedule"} className={mode === "schedule" ? "active" : ""} onClick={() => onModeChange("schedule")}>
            <CalendarDays aria-hidden="true" /> Schedule online
          </button>
          <button type="button" role="tab" aria-selected={mode === "message"} className={mode === "message" ? "active" : ""} onClick={() => onModeChange("message")}>
            <MessageCircle aria-hidden="true" /> Send details
          </button>
        </div>

        {mode === "schedule" ? (
          <div className="schedule-panel" role="tabpanel">
            <div className="schedule-summary">
              <div className="schedule-icon"><CalendarDays aria-hidden="true" /></div>
              <div>
                <span>30-MINUTE INTRODUCTION</span>
                <h3>Academic planning consultation</h3>
                <p>Discuss goals, mentor preferences, session format, and the best next step for your child.</p>
              </div>
            </div>
            <ul>
              <li><CheckCircle2 aria-hidden="true" /> No commitment required</li>
              <li><CheckCircle2 aria-hidden="true" /> Choose a time in Calendly</li>
              <li><CheckCircle2 aria-hidden="true" /> Receive clear matching next steps</li>
            </ul>
            <a className="button button-primary button-large modal-primary" href={consultationUrl} target="_blank" rel="noreferrer">
              View available times <ExternalLink aria-hidden="true" />
            </a>
            <p className="modal-alt">Prefer to talk first? <a href={`tel:${phoneHref}`}>Call {phoneDisplay}</a></p>
          </div>
        ) : (
          <form className="consultation-form" role="tabpanel" onSubmit={onSubmit}>
            <label>
              Parent or guardian name
              <input name="parentName" value={form.parentName} onChange={onChange} autoComplete="name" required />
            </label>
            <label>
              Email
              <input name="email" type="email" value={form.email} onChange={onChange} autoComplete="email" required />
            </label>
            <label>
              Student grade
              <select name="studentGrade" value={form.studentGrade} onChange={onChange} required>
                <option value="">Select grade level</option>
                <option>Grades K-5</option>
                <option>Grades 6-8</option>
                <option>Grades 9-12</option>
                <option>College / Other</option>
              </select>
            </label>
            <label>
              Main support area
              <select name="supportArea" value={form.supportArea} onChange={onChange}>
                <option>Math</option>
                <option>Science</option>
                <option>English / Writing</option>
                <option>Study planning</option>
                <option>Test preparation</option>
                <option>Other</option>
              </select>
            </label>
            <label className="full-field">
              What would you like help with?
              <textarea name="notes" value={form.notes} onChange={onChange} rows="4" placeholder="Share goals, scheduling preferences, or what has been difficult." />
            </label>
            <label className="honeypot" aria-hidden="true">
              Website
              <input name="website" value={form.website} onChange={onChange} tabIndex="-1" autoComplete="off" />
            </label>
            <label className="consent-field full-field">
              <input name="consent" type="checkbox" checked={form.consent} onChange={onChange} />
              <span>I agree that EduBridge may use these details to respond to this inquiry.</span>
            </label>
            <button className="button button-primary button-large full-field" type="submit" disabled={!canSubmit || submitState.status === "loading"}>
              {submitState.status === "loading" ? "Sending..." : apiEnabled ? "Send consultation request" : "Open email request"}
              <Send aria-hidden="true" />
            </button>
            {!apiEnabled && <p className="form-note full-field">This opens a pre-addressed email so no family information is stored on the public website.</p>}
            {submitState.message && <p className={`form-status form-status-${submitState.status} full-field`} role="status">{submitState.message}</p>}
          </form>
        )}
      </section>
    </div>
  );
}

function LegalModal({ onClose, type }) {
  const content = legalContent[type];
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="legal-modal" role="dialog" aria-modal="true" aria-labelledby="legal-title">
        <button className="modal-close" type="button" aria-label={`Close ${content.title}`} onClick={onClose}><X aria-hidden="true" /></button>
        <p className="eyebrow">{content.eyebrow}</p>
        <h2 id="legal-title">{content.title}</h2>
        <p className="legal-intro">{content.intro}</p>
        <div className="legal-sections">
          {content.sections.map(([heading, copy]) => (
            <section key={heading}><h3>{heading}</h3><p>{copy}</p></section>
          ))}
        </div>
        <p className="legal-updated">Last updated July 9, 2026.</p>
      </section>
    </div>
  );
}

function BridgeLogo() {
  return (
    <span className="logo-lockup">
      <BridgeMark />
      <span><strong>Edu</strong>Bridge</span>
    </span>
  );
}

function BridgeMark() {
  return (
    <svg className="bridge-mark" viewBox="0 0 64 64" role="img" aria-label="EduBridge mark">
      <path className="mark-cap" d="M32 4 58 14 32 24 6 14 32 4Z" />
      <path d="M12 47h40M17 46c8-17 22-17 30 0M21 45V24m22 21V24M25 38c5-4 9-4 14 0" />
      <path d="M52 16v13m0 0 4 6m-4-6-4 6" />
    </svg>
  );
}

export default App;
