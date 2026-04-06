import { Mail, UserCheck, FileText, MessageSquare, Clock, CheckCircle } from "lucide-react";
import { useState } from "react";

type Notification = {
  id: number;
  type: "application" | "submission" | "message" | "reminder" | "started" | "completed";
  title: string;
  body: string;
  time: string;
  read?: boolean;
  link?: string;
};

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: "application",
    title: "New applicant for Frontend Developer Intern",
    body: "Student: Alice Johnson applied to Frontend Developer Intern.",
    time: "2 hours ago",
    link: "/company/submissions",
  },
  {
    id: 5,
    type: "started",
    title: "Internship started: Frontend Developer Intern",
    body: "Student: Alice Johnson has started the Frontend Developer internship.",
    time: "just now",
    link: "/company/cases/1/tasks",
  },
  {
    id: 6,
    type: "completed",
    title: "Internship completed: ML Engineer Intern",
    body: "Student: Bob Lee has completed the ML Engineer internship.",
    time: "2 days ago",
    link: "/company/candidates",
  },
];

export const Notifications = () => {
  const [items, setItems] = useState<Notification[]>(mockNotifications);

  const markRead = (id: number) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, read: true } : it)));
  };

  const dismiss = (id: number) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  return (
    <div className="flex flex-col gap-10 px-30 py-8">

      {/* Header */}
      <div className="animate-slideInRight">
        <h2 className="text-4xl font-bold">Notifications</h2>
        <p className="text-gray-600 mt-2">
          Get news about students interested in your cases and other updates.
        </p>
      </div>

      {/* List */}
      {items.length === 0 ? (
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_black] rounded flex flex-col items-center justify-center text-center gap-6 p-20 animate-stagger-1">
          <div className="w-24 h-24 bg-[#EDE7FF] border-2 border-black rounded flex items-center justify-center shadow-[4px_4px_0px_black]">
            <Mail size={40} />
          </div>

          <h3 className="text-2xl font-bold">No notifications yet.</h3>

          <p className="text-gray-600 max-w-lg">Your notifications will appear here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((n) => (
            <div
              key={n.id}
              className={`bg-white border-2 border-black p-6 rounded shadow-[4px_4px_0px_black] flex items-start gap-4 justify-between ${n.read ? 'opacity-60' : ''}`}
            >
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-[#EDE7FF] border-2 border-black rounded flex items-center justify-center">
                  {n.type === 'application' && <UserCheck size={20} />}
                  {n.type === 'submission' && <FileText size={20} />}
                  {n.type === 'message' && <MessageSquare size={20} />}
                  {n.type === 'reminder' && <Clock size={20} />}
                  {n.type === 'started' && <UserCheck size={20} />}
                  {n.type === 'completed' && <CheckCircle size={20} />}
                </div>

                <div>
                  <h4 className="font-semibold">{n.title}</h4>
                  <p className="text-sm text-gray-600">{n.body}</p>
                  <p className="text-xs text-gray-400 mt-2">{n.time}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {n.read && (
                  <button onClick={() => dismiss(n.id)} className="border-2 border-black px-4 py-2 bg-white rounded">Dismiss</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};