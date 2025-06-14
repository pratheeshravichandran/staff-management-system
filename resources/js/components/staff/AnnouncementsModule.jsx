import React from "react";

const AnnouncementsModule = () => {
  // Mock data for announcements
  const announcements = [
    {
      id: 1,
      title: "Office closed on Friday",
      content: "The office will be closed on Friday due to maintenance work.",
      date: "2025-06-06",
    },
    {
      id: 2,
      title: "New health insurance plan",
      content: "We have introduced a new health insurance plan for all employees starting next month.",
      date: "2025-05-28",
    },
    {
      id: 3,
      title: "Team outing scheduled",
      content: "Team outing is scheduled for June 15th. Please RSVP by June 5th.",
      date: "2025-05-30",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">College Announcements</h3>
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{announcement.title}</h4>
                  <p className="text-gray-700 mt-1">{announcement.content}</p>
                </div>
                <span className="text-sm text-gray-500">{announcement.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsModule;
