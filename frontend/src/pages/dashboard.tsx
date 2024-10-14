import { title } from "@/components/primitives";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import { useEffect, useState } from "react";
import axios from "axios";

// Define a type for decoded token structure with the additional fields
interface AdminData {
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  phone: string;
  designation: string;
  gender: string;
  course: string;
}

// Admin Dashboard Component
const AdminDashboard = () => {
  const [adminData, setAdminData] = useState<AdminData | null>(null);

  // Function to decode token and fetch admin details
  const fetchAdminDetails = async () => {
    try {
      const token = localStorage.getItem("token"); // Replace with your token storage logic

      if (token) {
        const userResponse = await axios.get('http://localhost:5000/api/admin/admin-details', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // console.log(userResponse.data);
        setAdminData(userResponse.data);
      }
    } catch (error) {
      console.error("Failed to fetch admin details", error);
    }
  };

  useEffect(() => {
    fetchAdminDetails(); // Fetch admin details on component mount
  }, []);

  return (
   <div className="flex flex-col w-full min-h-screen  p-8">
      <Card className="w-full mb-8">
        <CardBody className="flex flex-row items-center p-6">
          <Image
            src={adminData?.imageUrl || "/default-photo.png"}
            alt="Admin Photo"
            className="rounded-full object-cover w-24 h-24 mr-6"
          />
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome, {adminData?.name}!</h1>
            <p className="text-gray-600">It's great to see you on the dashboard today.</p>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="w-full">
          <CardBody>
            <h2 className="text-2xl font-semibold mb-4">Admin Information</h2>
            <div className="space-y-4">
              <h4>{adminData?.username}</h4>
              <h4>{adminData?.email}</h4>
              <h4>{adminData?.phone}</h4>
              <h4>{adminData?.designation}</h4>
              
            </div>
          </CardBody>
        </Card>

    
      </div>
    </div>
  );
};

export default AdminDashboard;
