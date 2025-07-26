// useStaffMetadata.js
import { useEffect, useState } from "react";
import axios from "axios";

export default function useStaffMetadata() {
  const [staffData, setStaffData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles]             = useState([]);
  const [genders, setGenders]         = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const api = axios.create({
      headers: { Authorization: `Bearer ${token}` } 
    });

    api.get("/get/metadata").then(r => {
      setRoles(r.data.roles   ?? []);
      setGenders(r.data.genders ?? []);
    });

    api.get("/departments").then(r => {
      setDepartments(
        Array.isArray(r.data) ? r.data : r.data.departments ?? []
      );
    });

    axios.get("/get/allstaffs", { headers: { Authorization: token } })
    .then(response => {
      const formattedStaff = response.data.staff.map(item => ({
        id: item.id,
        firstName: item.first_name,
        lastName: item.last_name,
        gender: item.gender,
        email: item.email,
        phone: item.phone_number,
        dob: item.dob?.split("T")[0] || "",
        designation: item.designation,
        role: item.role_name,
        department_id: item.department_id || "Unassigned",
        department: item.department || "Unassigned",
        status: item.status,
        joiningDate: item.joining_date?.split("T")[0] || "",
        address: item.address || "",
        staffID: item.staff_id,
        salary: parseFloat(item.salary) || 0,
        photo: item.profile_pic || null,
      }));
      setStaffData(formattedStaff);
    })
    .catch(error => {
      console.error("Staff Fetch Error:", error.response?.data || error);
    });

  }, []);

  return { departments, roles, genders ,staffData ,setStaffData};
}
