import { title } from "@/components/primitives";
import TabComponent from "@/components/tabcomponent";

import DefaultLayout from "@/layouts/default";


export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">


         <TabComponent/>


        <div className="inline-block max-w-xl text-center justify-center">
        
          <span className={title()}>YOUR ONE-STOP SOLUTION FOR&nbsp;</span>
        
          <span className={title({ color: "violet" })}> EFFICIENT.&nbsp;</span>
          <br />
          <span className={title()}>
          EMPLOYEE MANAGEMENT
          </span>
          
        </div>

       
      </section>
    </DefaultLayout>
  );
}
