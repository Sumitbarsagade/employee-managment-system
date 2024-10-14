

import DefaultLayout from "@/layouts/default";

import AdminSignUp from "@/components/adminsignup";
export default function AdminSignUpPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">

      <div className="w-full ">
      <AdminSignUp/>
      </div>
       


        

       
      </section>
    </DefaultLayout>
  );
}

  