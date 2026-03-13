import { useState, useEffect } from "react";
import {
  Plus,
  Send,
  Trash2,
  Edit3,
  X,
  Check,
  AlertCircle,
  Clock,
  FileText,
  ChevronDown,
  Pill,
  Salad,
  FlaskConical,
  MessageSquare,
} from "lucide-react";
import { doctorAPI, notesAPI } from "../../services/api";

const CATEGORIES = [
  { label: "General Advice", icon: MessageSquare, color: "#6366f1" },
  { label: "Follow-up", icon: Clock, color: "#0ea5e9" },
  { label: "Medication", icon: Pill, color: "#10b981" },
  { label: "Lifestyle/Diet", icon: Salad, color: "#f59e0b" },
  { label: "Lab Result", icon: FlaskConical, color: "#ec4899" },
];

const PRIORITIES = [
  { label: "Normal", color: "#6b7280", bg: "#1f2937" },
  { label: "Important", color: "#f59e0b", bg: "#451a03" },
  { label: "Urgent", color: "#ef4444", bg: "#450a0a" },
];

const getCategory = (c) =>
  CATEGORIES.find((x) => x.label === c) || CATEGORIES[0];
const getPriority = (p) =>
  PRIORITIES.find((x) => x.label === p) || PRIORITIES[0];

const Badge = ({ label, color, bg }) => (
  <span
    style={{
      background: bg,
      color,
      fontSize: 11,
      fontWeight: 600,
      padding: "2px 9px",
      borderRadius: 20,
      letterSpacing: 0.5,
      border: `1px solid ${color}40`,
    }}
  >
    {label}
  </span>
);

const fieldStyle = {
  background: "#111827",
  border: "1px solid #374151",
  borderRadius: 8,
  padding: "10px 12px",
  color: "#f9fafb",
  fontSize: 13,
  width: "100%",
  boxSizing: "border-box",
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color 0.2s",
};

const iconBtnStyle = (bg) => ({
  background: bg,
  border: "none",
  borderRadius: 6,
  width: 28,
  height: 28,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
});

// ── Custom Select ──────────────────────────────────────────────────────────
const CustomSelect = ({ value, onChange, options, label, disabled }) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.label === value) || options[0];
  return (
    <div className="google-sans-code-400" style={{ position: "relative" }}>
      {label && (
        <label
          style={{
            fontSize: 11,
            color: "#6b7280",
            display: "block",
            marginBottom: 4,
            letterSpacing: 0.5,
          }}
        >
          {label}
        </label>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        style={{
          width: "100%",
          background: "#111827",
          border: "1px solid #374151",
          borderRadius: 8,
          padding: "9px 12px",
          color: selected.color ?? "#f9fafb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: disabled ? "not-allowed" : "pointer",
          fontSize: 13,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <span>{selected.label}</span>
        <ChevronDown
          size={14}
          style={{
            color: "#6b7280",
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
        />
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 50,
            background: "#1f2937",
            border: "1px solid #374151",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          {options.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => {
                onChange(opt.label);
                setOpen(false);
              }}
              style={{
                width: "100%",
                padding: "9px 12px",
                background: "transparent",
                border: "none",
                borderBottom: "1px solid #374151",
                color: opt.color ?? "#f9fafb",
                cursor: "pointer",
                textAlign: "left",
                fontSize: 13,
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#374151")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Note Card ──────────────────────────────────────────────────────────────
const NoteCard = ({ note, onDelete, onEdit }) => {
  const cat = getCategory(note.category);
  const pri = getPriority(note.priority);
  const CatIcon = cat.icon;
  const date = new Date(note.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className="google-sans-code-400"
      style={{
        background: "#0f172a",
        border: "1px solid #1f2937",
        borderRadius: 12,
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        transition: "border-color 0.2s, transform 0.15s",
        animation: "slideIn 0.25s ease forwards",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#374151";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#1f2937";
        e.currentTarget.style.transform = "none";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              flexShrink: 0,
              background: `${cat.color}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CatIcon size={15} style={{ color: cat.color }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                color: "#f9fafb",
                fontWeight: 600,
                fontSize: 14,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {note.title}
            </div>
            <div style={{ color: "#6b7280", fontSize: 11, marginTop: 2 }}>
              To:{" "}
              <span style={{ color: "#9ca3af" }}>
                {note.patientId?.name ?? "Patient"}
              </span>
              <span style={{ margin: "0 6px", color: "#374151" }}>·</span>
              {date}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          <button
            onClick={() => onEdit(note)}
            style={iconBtnStyle("#1f2937")}
            title="Edit"
            onMouseEnter={(e) => (e.currentTarget.style.background = "#374151")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1f2937")}
          >
            <Edit3 size={13} style={{ color: "#9ca3af" }} />
          </button>
          <button
            onClick={() => onDelete(note._id)}
            style={iconBtnStyle("#1a0404")}
            title="Delete"
            onMouseEnter={(e) => (e.currentTarget.style.background = "#450a0a")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1a0404")}
          >
            <Trash2 size={13} style={{ color: "#ef4444" }} />
          </button>
        </div>
      </div>

      <p style={{ color: "#d1d5db", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
        {note.content}
      </p>

      <div
        style={{
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Badge label={note.category} color={cat.color} bg={`${cat.color}15`} />
        <Badge label={note.priority} color={pri.color} bg={pri.bg} />
        {note.isRead && <Badge label="Read" color="#10b981" bg="#052e16" />}
        {note.acknowledged && (
          <Badge label="Acknowledged" color="#6366f1" bg="#1e1b4b" />
        )}
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────
export default function DoctorNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [toast, setToast] = useState(null);
  const [filterCat, setFilterCat] = useState("All");
  const [patients, setPatients] = useState([]);
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await notesAPI.getDoctorNotes();
      setNotes(res.data?.data ?? res.data ?? []);
    } catch {
      showToast("Failed to load notes", "error");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    doctorAPI
      .getDoctorPatients()
      .then((res) => setPatients(res.data.patients ?? []))
      .catch(console.error);
    fetchNotes();
  }, []);

  const emptyForm = {
    patientId: "",
    title: "",
    content: "",
    category: "General Advice",
    priority: "Normal",
  };
  const [form, setForm] = useState(emptyForm);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientId || !form.title || !form.content) {
      showToast("Patient, title and content are required", "error");
      return;
    }
    setSubmitting(true);
    try {
      if (editingNote) {
        await notesAPI.updateNote(editingNote._id, {
          title: form.title,
          content: form.content,
          category: form.category,
          priority: form.priority,
        });
        showToast("Note updated");
      } else {
        await notesAPI.createNote(form);
        showToast("Note sent to patient");
      }
      setForm(emptyForm);
      setShowForm(false);
      setEditingNote(null);
      fetchNotes();
    } catch {
      showToast("Failed to save note", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this note?")) return;
    try {
      await notesAPI.deleteNote(id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      showToast("Note deleted");
    } catch {
      showToast("Failed to delete", "error");
    }
  };

  const handleEdit = (note) => {
    setForm({
      patientId: note.patientId?._id ?? note.patientId,
      title: note.title,
      content: note.content,
      category: note.category,
      priority: note.priority,
    });
    setEditingNote(note);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingNote(null);
    setForm(emptyForm);
  };

  const filtered =
    filterCat === "All" ? notes : notes.filter((n) => n.category === filterCat);

  const stats = [
    { label: "TOTAL", value: notes.length, color: "#6366f1" },
    {
      label: "URGENT",
      value: notes.filter((n) => n.priority === "Urgent").length,
      color: "#ef4444",
    },
    {
      label: "UNREAD",
      value: notes.filter((n) => !n.isRead).length,
      color: "#f59e0b",
    },
  ];

  return (
    <div
      className="google-sans-code-400"
      style={{
        minHeight: "100vh",
        background: "#030712",
        padding: "36px 24px",
        fontFamily: "'Spline Sans Mono', monospace",
      }}
    >
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes toastIn { from { opacity: 0; transform: translateX(16px); } to { opacity: 1; transform: none; } }
        @keyframes spin    { to   { transform: rotate(360deg); } }
        textarea:focus, input:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px #6366f118 !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #1f2937; border-radius: 2px; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 999,
            background: toast.type === "error" ? "#450a0a" : "#052e16",
            border: `1px solid ${toast.type === "error" ? "#ef444440" : "#10b98140"}`,
            color: toast.type === "error" ? "#f87171" : "#34d399",
            padding: "10px 16px",
            borderRadius: 10,
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 8,
            animation: "toastIn 0.2s ease",
            fontFamily: "'Spline Sans Mono', monospace",
          }}
        >
          {toast.type === "error" ? (
            <AlertCircle size={14} />
          ) : (
            <Check size={14} />
          )}
          {toast.msg}
        </div>
      )}

      <div style={{ maxWidth: 840, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 28,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                color: "#6366f1",
                fontSize: 11,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Clinical Notes
            </div>
            <h1
              style={{
                color: "#f9fafb",
                fontSize: 24,
                fontWeight: 700,
                margin: 0,
                letterSpacing: -0.5,
              }}
            >
              Patient Notes
            </h1>
            <p style={{ color: "#4b5563", fontSize: 12, margin: "5px 0 0" }}>
              Send instructions, follow-ups &amp; lab results directly to
              patients
            </p>
          </div>
          <button
            onClick={() => (showForm ? closeForm() : setShowForm(true))}
            style={{
              background: showForm ? "#1f2937" : "#6366f1",
              color: showForm ? "#9ca3af" : "white",
              border: "none",
              borderRadius: 10,
              padding: "10px 18px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "inherit",
              transition: "all 0.2s",
            }}
          >
            {showForm ? (
              <>
                <X size={15} /> Cancel
              </>
            ) : (
              <>
                <Plus size={15} /> New Note
              </>
            )}
          </button>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10,
            marginBottom: 24,
          }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                background: "#0f172a",
                border: "1px solid #1f2937",
                borderRadius: 10,
                padding: "14px 16px",
              }}
            >
              <div style={{ color: s.color, fontSize: 24, fontWeight: 700 }}>
                {s.value}
              </div>
              <div
                style={{
                  color: "#4b5563",
                  fontSize: 10,
                  marginTop: 3,
                  letterSpacing: 1,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Compose / Edit Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            style={{
              background: "#0f172a",
              border: "1px solid #1f2937",
              borderRadius: 14,
              padding: "20px",
              marginBottom: 26,
              animation: "slideIn 0.2s ease",
            }}
          >
            <div
              style={{
                color: "#6b7280",
                fontSize: 11,
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <FileText size={12} />{" "}
              {editingNote ? "Edit note" : "Compose note"}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: 12,
              }}
            >
              {/* Patient */}
              <div>
                <label
                  style={{
                    fontSize: 11,
                    color: "#6b7280",
                    display: "block",
                    marginBottom: 4,
                    letterSpacing: 0.5,
                  }}
                >
                  PATIENT
                </label>
                <select
                  value={form.patientId}
                  onChange={(e) =>
                    setForm({ ...form, patientId: e.target.value })
                  }
                  disabled={!!editingNote}
                  style={{
                    ...fieldStyle,
                    appearance: "none",
                    opacity: editingNote ? 0.5 : 1,
                  }}
                >
                  <option value="">Select patient…</option>
                  {patients.map((p) => (
                    <option key={p._id} value={p.userId._id}>
                      {" "}
                      {p.userId?.name ?? p._id}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label
                  style={{
                    fontSize: 11,
                    color: "#6b7280",
                    display: "block",
                    marginBottom: 4,
                    letterSpacing: 0.5,
                  }}
                >
                  TITLE
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Post-consultation follow-up"
                  style={fieldStyle}
                />
              </div>

              <CustomSelect
                label="CATEGORY"
                value={form.category}
                onChange={(v) => setForm({ ...form, category: v })}
                options={CATEGORIES}
              />

              <CustomSelect
                label="PRIORITY"
                value={form.priority}
                onChange={(v) => setForm({ ...form, priority: v })}
                options={PRIORITIES}
              />
            </div>

            {/* Content */}
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  fontSize: 11,
                  color: "#6b7280",
                  display: "block",
                  marginBottom: 4,
                  letterSpacing: 0.5,
                }}
              >
                CONTENT
              </label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Write your clinical note here…"
                rows={4}
                style={{ ...fieldStyle, resize: "vertical", lineHeight: 1.7 }}
              />
            </div>

            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}
            >
              <button
                type="button"
                onClick={closeForm}
                style={{
                  background: "#1f2937",
                  color: "#9ca3af",
                  border: "none",
                  borderRadius: 8,
                  padding: "9px 16px",
                  cursor: "pointer",
                  fontSize: 13,
                  fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: submitting ? "#374151" : "#6366f1",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  padding: "9px 18px",
                  cursor: submitting ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "inherit",
                  transition: "background 0.2s",
                }}
              >
                <Send size={14} />
                {submitting
                  ? "Sending…"
                  : editingNote
                    ? "Update note"
                    : "Send to patient"}
              </button>
            </div>
          </form>
        )}

        {/* Category filter tabs */}
        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 18,
            flexWrap: "wrap",
          }}
        >
          {["All", ...CATEGORIES.map((c) => c.label)].map((cat) => {
            const active = filterCat === cat;
            const color =
              CATEGORIES.find((c) => c.label === cat)?.color ?? "#6366f1";
            return (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                style={{
                  background: active ? `${color}18` : "transparent",
                  color: active ? color : "#4b5563",
                  border: `1px solid ${active ? color + "40" : "#1f2937"}`,
                  borderRadius: 20,
                  padding: "5px 13px",
                  fontSize: 11,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.15s",
                  letterSpacing: 0.3,
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Notes list */}
        {loading ? (
          <div
            style={{ textAlign: "center", color: "#4b5563", padding: "64px 0" }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                border: "2px solid #1f2937",
                borderTopColor: "#6366f1",
                borderRadius: "50%",
                animation: "spin 0.7s linear infinite",
                margin: "0 auto 12px",
              }}
            />
            <div style={{ fontSize: 13 }}>Loading notes…</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 0" }}>
            <FileText
              size={40}
              style={{
                display: "block",
                margin: "0 auto 12px",
                color: "#1f2937",
              }}
            />
            <div style={{ color: "#4b5563", fontSize: 14 }}>No notes found</div>
            <div style={{ color: "#374151", fontSize: 12, marginTop: 4 }}>
              {filterCat !== "All"
                ? `No "${filterCat}" notes yet`
                : "Create a note to get started"}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
