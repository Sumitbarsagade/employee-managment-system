
import { CardHeader, CardBody, Input, Button } from "@nextui-org/react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom'; // use 'react-router-dom' instead of 'react-router'
import { toast } from 'react-toastify';
import axios from "axios";

export const SignInFormForAdmin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start loading when the form is submitted

    try {
      console.log(formData);
      // Handle the form submission logic here
      const data = new FormData();
      data.append('username', formData.username);
      data.append('password', formData.password);

     

      // Post the data to your backend API
      const response = await axios.post('http://localhost:5000/api/auth/admin/signin', {
        username: formData.username,
        password: formData.password
      },
      { headers: {
        Accept: 'application/json',
      }}
     
      );

      // console.log(response.data);
      localStorage.setItem('token', response.data.token);
      setLoading(false);
      toast.success('Admin login successfully!');
      navigate("/admin/dashboard"); // Navigate to the dashboard or any page

    } catch (error) {
      setLoading(false); // Stop loading if there's an error
      if (axios.isAxiosError(error)){
        toast.error(error.response?.data.message);
      }
      if (error instanceof Error) {
        console.error('Error:', error);
   
      } else {
        console.error('Unknown error occurred');
      }
    }
  };

  return (
    <div className="w-full mx-auto">
      <CardHeader className="flex justify-center">
        <h1 className="text-2xl font-bold">Sign In</h1>
      </CardHeader>
      <CardBody className="space-y-4">
        <form onSubmit={handleSubmit}>
          <Input
            name="username"
            className="my-4"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter your username"
            variant="bordered"
          />
          <Input
            name="password"
            className="my-4"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            type="password"
            required
            variant="bordered"
          />
          <Button
            color="primary"
            className="w-full"
            type="submit" // Ensure this button submits the form
            disabled={loading} // Disable the button when loading
          >
            {loading ? 'Signing In...' : 'Sign In'}  {/* Show loading text when signing in */}
          </Button>
        </form>
      </CardBody>
    </div>
  );
};
