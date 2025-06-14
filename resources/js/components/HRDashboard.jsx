import React from "react";
import Card from "./ui/Card";
import CardContent from "./ui/CardContent";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Bell, Users, CalendarCheck, DollarSign, Menu } from "lucide-react";

export default function HRDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Menu className="text-gray-600" />
          <h1>HR Dashboard</h1>
        </div>
        <div className="text-gray-600">Welcome, Admin</div>
      </nav>
    </div>
  );
}