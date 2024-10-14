import {Tabs, Tab, Card, CardBody} from "@nextui-org/react";
import { SignInFormForAdmin } from "./adminsignin";
import { SignInFormForEmployee } from "./employeesignin";

export default function TabComponent() {
  return (
    <div className="flex w-full flex-col items-center ">
      <Tabs aria-label="Options">


        
        <Tab key="User" title="User">
          <Card>
          <CardBody className="w-96">
              <SignInFormForEmployee/>
            </CardBody>
          </Card>  
        </Tab>
        <Tab key="Admin" title="Admin">
          <Card>
            <CardBody className="w-96">
              <SignInFormForAdmin/>
            </CardBody>
          </Card>  
        </Tab>
        
      </Tabs>
    </div>  
  );
}