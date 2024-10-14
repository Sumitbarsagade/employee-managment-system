import { Button, Input,RadioGroup, Radio, Checkbox, Dropdown,DropdownTrigger, DropdownMenu, DropdownItem,Card,CardBody,Image, Spinner, } from "@nextui-org/react";
import { useState } from "react";
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import axios from "axios";

export default function AddEmployee() {
    const navigate= useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
    email: "",
    phone: "",
    gender: "",
    designation: "",
    course: "",   // Ensure this is typed as an array of strings
    photo: null as File | null,
  });


  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      
      // Update form data
      setFormData((prevState) => ({
        ...prevState,
        photo: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async(e: React.FormEvent) => {


    e.preventDefault();

    try{

        console.log(formData);
        // Handle the form submission logic here
        const data = new FormData(); 
    
        data.append('username', formData.username);
        data.append('name', formData.name);
        data.append('password', formData.password);
        data.append('email', formData.email);
        data.append('phone', formData.phone);
        data.append('gender', formData.gender);
        data.append('designation', formData.designation);
        data.append('course', formData.course);
         // Append ingredients and procedureSteps directly as arrays (no need for JSON.stringify)
      
        if ( previewImage) {
          data.append('image',previewImage); // Append image file
        }
        const token = localStorage.getItem('token');
    
        // Post the recipe data to your backend API
        const response = await axios.post('http://localhost:5000/api/admin/employee', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        
      
        
        setLoading(false);
        // alert("Recipe saved successfully");
        toast.success('Form submitted successfully!');
        navigate("/dashboard/viewemployee");
    }
  
   
    catch (error) {
        if (error instanceof Error) {
          console.error('Error:', error);
          toast.error('Something went wrong!');
        } else {
          console.error('Unknown error occurred');
        }
      }





  };

  
  return (
    <>
     <form className="p-4 max-w-full  mx-auto" onSubmit={handleSubmit}>
      
      {/* upload Photo */}
           
           <Card className="max-w-full mx-auto">
           <CardBody className="flex flex-col md:flex-row items-center gap-4 m-4">
             <div className="w-56 h-56 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
               {previewImage ? (
                 <Image
                   src={previewImage}
                   alt="Uploaded preview"
                   className="w-full h-full object-cover"
                 />
               ) : (
                <img src="/man.png" />
               )}
             </div>
             <div className="flex-grow">
               <h3 className="text-lg font-semibold mb-2">Upload Photo</h3>
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
               {previewImage && (
                 <p className="mt-2 text-sm text-gray-600">Image selected</p>
               )}
             </div>
           </CardBody>
         </Card>
     
     
     {/* Username */}
           <Input
             fullWidth
             className="p-4"
             label="Username"
             placeholder="Enter your username"
             name="username"
             value={formData.username}
             onChange={handleInputChange}
             required
           />
     
           {/* Name */}
           <Input
             fullWidth
               className="p-4"
             label="Name"
             placeholder="Enter your full name"
             name="name"
             value={formData.name}
             onChange={handleInputChange}
             required
           />
     
           {/* Email */}
           <Input
             fullWidth
               className="p-4"
             type="email"
             label="Email"
             placeholder="Enter your email"
             name="email"
             value={formData.email}
             onChange={handleInputChange}
             required
           />
     
           {/* Password */}
           <Input
           type="password"
             className="p-4"
             fullWidth
             label="Password"
           
             placeholder="Enter your password"
             name="password"
             value={formData.password}
             onChange={handleInputChange}
             required
           />
     
           {/* Mobile Number */}
           <Input
             fullWidth
             label="Mobile No"
               className="p-4"
             placeholder="Enter your mobile number"
             name="phone"
             value={formData.phone}
             onChange={handleInputChange}
             required
           />
     
           {/* Designation Dropdown */}
           <Dropdown   className="p-4">
           <DropdownTrigger>
             <Button 
               variant="bordered" 
             >
               Select designation
             </Button>
           </DropdownTrigger>
           <DropdownMenu aria-label="Static Actions"
           
           onAction={(key) => setFormData({ ...formData, designation: key as string })}
           
           >
             <DropdownItem key="HR">HR</DropdownItem>
             <DropdownItem key="Manager">Manager</DropdownItem>
             <DropdownItem key="Sales">Sales</DropdownItem>
            
           </DropdownMenu>
         </Dropdown>
     
     
     
     
     
     
         
     
           {/* Gender Radio */}
           <RadioGroup
             className="p-4"
             label="Gender"
             name="gender"
             onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
           
           >
             <Radio value="Male">Male</Radio>
             <Radio value="Female">Female</Radio>
           </RadioGroup>
     
           {/* Course Checkboxes */}
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
     
          
     
           {/* Submit Button */}
           <Button type="submit" color="primary" fullWidth>
             Sign Up
           </Button>
         </form>
         {loading? <div className="fixed p-10 bg-slate-700 rounded-sm top-[50%] left-[50%]"> <Spinner  /></div>: ""}
    </>
   
  );
}

