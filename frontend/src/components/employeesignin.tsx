
import {  CardHeader, CardBody, Input, Button } from "@nextui-org/react";

export const SignInFormForEmployee = () => {
  return (
    <div className="w-full mx-auto">
      <CardHeader className="flex justify-center">
        <h1 className="text-2xl font-bold">Sign In</h1>
      </CardHeader>
      <CardBody className="space-y-4">
       
        <Input
    
          placeholder="Enter your email"
          type="email"
          variant="bordered"
        />
        <Input
          
          placeholder="Enter your password"
          type="password"
          variant="bordered"
        />
        <Button color="primary" className="w-full">
          Sign In
        </Button>
      </CardBody>
    </div>
  );
};

