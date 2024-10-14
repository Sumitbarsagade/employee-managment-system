import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  RadioGroup,
  Radio,
  Checkbox,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Card,
  CardBody,
  Image,
} from "@nextui-org/react";
import axios from "axios";
import { toast } from 'react-toastify';

interface EditModelProps {
  employeeId: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void; // Callback to refresh the employee list after update
}

const EditModel: React.FC<EditModelProps> = ({ employeeId, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    gender: "",
    designation: "",
    course: "",
    photo: null as File | null,
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && employeeId) {
      fetchEmployeeDetails();
    } else {
      // Reset form data when modal is closed
      resetForm();
    }
  }, [isOpen, employeeId]);

  const fetchEmployeeDetails = async () => {
    try {
      console.log(employeeId);
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/admin/employee/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);
      const employeeData = response.data;
      setFormData({
        username: employeeData.username,
        name: employeeData.name,
        email: employeeData.email,
        phone: employeeData.phone,
        gender: employeeData.gender,
        designation: employeeData.designation,
        course: employeeData.course || [],
        photo: null,
      });
      setPreviewImage(employeeData.imageUrl);
    } catch (error) {
      console.error("Failed to fetch employee details", error);
      toast.error("Failed to load employee details");
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      name: "",
      email: "",
      phone: "",
      gender: "",
      designation: "",
      course: "",
      photo: null,
    });
    setPreviewImage(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCourseChange = (selectedCourse: string) => {
    setFormData((prevState) => ({
      ...prevState,
      course: selectedCourse,  // Update course as a single string
    }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFormData((prevState) => ({
        ...prevState,
        photo: file,
      }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();

      data.append('username', formData.username);
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('gender', formData.gender);
      data.append('designation', formData.designation);
      data.append('course', formData.course);
      // Append ingredients and procedureSteps directly as arrays (no need for JSON.stringify)
   
     if ( previewImage) {
       data.append('image',previewImage); // Append image file
     }

      await axios.put(`http://localhost:5000/api/admin/employee/${employeeId}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Employee updated successfully!');
      onUpdate(); // Refresh the employee list
      onClose(); // Close the modal
    } catch (error) {
      console.error("Failed to update employee", error);
      toast.error('Failed to update employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Edit Employee</ModalHeader>
        <ModalBody>
          <Card>
            <CardBody className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-56 h-56 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt="Employee"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img src="/man.png" alt="Default" />
                )}
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold mb-2">Update Photo</h3>
                <input
                  type="file"
                  id="photoUpload"
                  name="photo"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="photoUpload">
                  <Button as="span" color="primary" className="cursor-pointer">
                    Choose File
                  </Button>
                </label>
              </div>
            </CardBody>
          </Card>

          <Input
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="mt-4"
          />
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-4"
          />
          <Input
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-4"
          />
          <Input
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="mt-4"
          />

          <Dropdown className="mt-4">
            <DropdownTrigger>
              <Button variant="bordered">
                {formData.designation || "Select designation"}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Designation"
              onAction={(key) => setFormData({ ...formData, designation: key as string })}
            >
              <DropdownItem key="HR">HR</DropdownItem>
              <DropdownItem key="Manager">Manager</DropdownItem>
              <DropdownItem key="Sales">Sales</DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <RadioGroup
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="mt-4"
          >
            <Radio value="Male">Male</Radio>
            <Radio value="Female">Female</Radio>
          </RadioGroup>

          <div className="mt-4">
  <label>Course</label>
  <div>
    <Checkbox
     className="m-2"
      isSelected={formData.course.includes("MCA")}
      onChange={() => handleCourseChange("MCA")}
    >
      MCA
    </Checkbox>
    <Checkbox
     className="m-2"
      isSelected={formData.course.includes("BCA")}
      onChange={() => handleCourseChange("BCA")}
    >
      BCA
    </Checkbox>
    <Checkbox
     className="m-2"
      isSelected={formData.course.includes("BSc")}
      onChange={() => handleCourseChange("BSc")}
    >
      BSC
    </Checkbox>
    <Checkbox
     className="m-2"
      isSelected={formData.course.includes("BTECH")}
      onChange={() => handleCourseChange("BTECH")}
    >
      Btech
    </Checkbox>
    <Checkbox
    className="m-2"
      isSelected={formData.course.includes("MTech")}
      onChange={() => handleCourseChange("MTech")}
    >
      Mtech
    </Checkbox>
  </div>
</div>

        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSubmit} isLoading={loading}>
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditModel;
