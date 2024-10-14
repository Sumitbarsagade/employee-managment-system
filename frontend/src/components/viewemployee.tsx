import React, { useEffect, useState } from "react";
import { title } from "@/components/primitives";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Tooltip, Chip, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input,  } from "@nextui-org/react";
import { Edit3, Trash2, Eye } from 'lucide-react';
import axios from "axios";
import EditModel from "./editmodal";
import { SearchIcon } from "./icons";

interface Employee {
  course: string;
  _id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  phone: string;
  designation: string;
  createdAt: string;
}

const columns = [
  { name: "NAME", uid: "name" },
  { name: "DESIGNATION", uid: "designation" },
  { name: "COURSE", uid: "course" },
  { name: "EMAIL", uid: "email" },
  { name: "PHONE", uid: "phone" },
  { name: "CREATED AT", uid: "createdAt" },
  { name: "ACTIONS", uid: "actions" },
];

function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [noResults, setNoResults] = useState(false); // For displaying "No employees found"
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Modals for delete and edit
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  // Fetch employee data
  const fetchEmployees = async (query = '') => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        
       console.log(query)
        let response = query
          ? await axios.get(`http://localhost:5000/api/admin/search?q=${query}`, {
              headers: { Authorization: `Bearer ${token}` },
            }) // API to search employees
          : await axios.get('http://localhost:5000/api/admin/employees', {
              headers: { Authorization: `Bearer ${token}` },
            }); // Default API to get all employees

        const data = response.data;
     

        
        if(data.length === 0 && query !== ''){
         response =  await axios.get('http://localhost:5000/api/employees', {
            headers: { Authorization: `Bearer ${token}` },
          }); // Default API to get all employees
          let data = response.data;
          
          setEmployees(data);

        }
        else{
          setEmployees(data);
        }
        
        setNoResults(data.length === 0 && query !== ''); // Set no results flag if no employees found


        
       


      }
    } catch (error) {
      console.error("Failed to fetch employees", error);
    }
  };

  useEffect(() => {
    fetchEmployees(); // Fetch all employees on component mount
  }, []);

  // Handle delete confirmation
  const handleDeleteEmployee = async () => {
    if (selectedEmployee) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/admin/employee/${selectedEmployee._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchEmployees();
        setDeleteModalOpen(false); // Close the modal
        setSelectedEmployee(null); // Clear the selected employee
      } catch (error) {
        console.error("Failed to delete employee", error);
      }
    }
  };

  // Handle Edit button click
  const handleEditClick = (id: string) => {
    setSelectedEmployeeId(id); // Set the employee ID to be edited
    setEditModalOpen(true);  // Open the edit modal
  };

  // Handle Delete button click
  const handleDeleteClick = (employee: Employee) => {
    setSelectedEmployee(employee); // Set the selected employee
    setDeleteModalOpen(true);      // Open the delete modal
  };

  const handleUpdate = () => {
    fetchEmployees(); // Refresh employee list after update
  };

  // Handle input change for search
  const handleSearchChange = (e: { target: { value: any; }; }) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchEmployees(query); // Fetch with query, or all employees if empty
  };

  // Close the edit modal
  const handleEditModalClose = () => {
    setEditModalOpen(false); // Close the edit modal
  };

  const renderCell = (employee: Employee, columnKey: React.Key) => {
    const cellValue = employee[columnKey as keyof Employee];
    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: employee.imageUrl }}
            description={employee.email}
            name={employee.name || employee.username}
          />
        );
      case "designation":
        return (
          <Chip className="capitalize" color="primary" size="sm" variant="flat">
            {cellValue}
          </Chip>
        );
      case "createdAt":
        return new Date(cellValue as string).toLocaleDateString();
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="View Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <Eye size={20} />
              </span>
            </Tooltip>
            <Tooltip content="Edit Employee">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => handleEditClick(employee._id)}
              >
                <Edit3 size={20} />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete Employee">
              <span
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => handleDeleteClick(employee)}
              >
                <Trash2 size={20} />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  };

  return (
    <div className="p-8">
      <div className="w-full flex justify-between items-center">
        <h1 className={title({ color: "violet" })}>Employees</h1>
        <div className="relative">
          <Input
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-56"
            aria-label="Search"
            placeholder="Search..."
            startContent={<SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />}
            type="search"
          />
          {noResults && (
            <div className="absolute left-0 top-full mt-1 text-red-500 text-sm">
              Employees not found
            </div>
          )}
        </div>
      </div>

      <Table className="pt-4" aria-label="Employee table with custom cells">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={employees}>
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Confirm Deletion</ModalHeader>
          <ModalBody>
            <h1>Are you sure you want to delete {selectedEmployee?.name}?</h1>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onPress={handleDeleteEmployee}>
              Delete
            </Button>
            <Button onPress={() => setDeleteModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Employee Modal */}
      {selectedEmployeeId && (
        <EditModel
          employeeId={selectedEmployeeId || ""}
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}

export default Employees;
