import { Link } from "react-router-dom";
import { CheckCircle, Clock, ListTodo } from "lucide-react";

export const Dashboard = () => {
  return (
    <div className="flex flex-col gap-10 px-20 py-5">

      {/* Header */}
      <div>
        <h2 className="text-4xl font-bold">
          Welcome Back, Jessica!
        </h2>
        <p className="text-gray-700 mt-2">
          You're currently enrolled in 1 internship
        </p>
      </div>

      {/* Task Progress Card */}
      <div className="bg-white border-2 border-black p-8 shadow-[4px_4px_0px_black] rounded">

        <p className="text-sm text-gray-500">
          Keep going! You're making great progress 🚀
        </p>

        <h3 className="text-xl font-bold mt-2">
          Task Progress
        </h3>

        <div className="flex justify-between items-center mt-6">
          <span className="text-gray-700">Overall Completion</span>
          <span className="text-2xl font-bold">65%</span>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 border-2 border-black h-6 bg-gray-200 relative rounded">
          <div className="h-full bg-[#5D0CA0] w-[65%] rounded-[2px]" />
        </div>

        <p className="text-sm text-gray-600 mt-4">
          13 of 20 tasks completed
        </p>
      </div>

{/* Stats Cards */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

  {/* Completed */}
  <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_black] rounded flex justify-between items-start">
    
    <div>
      <h4 className="text-3xl font-bold text-[#6BCF7F]">13</h4>
      <p className="text-gray-600 mt-2">Completed Tasks</p>
    </div>

    <div className="border-2 border-black p-2 rounded bg-[#6BCF7F] text-white">
      <CheckCircle size={24} />
    </div>

  </div>

  {/* In Progress */}
  <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_black] rounded flex justify-between items-start">
    
    <div>
      <h4 className="text-3xl font-bold">4</h4>
      <p className="text-gray-600 mt-2">In Progress</p>
    </div>

    <div className="border-2 border-black p-2 rounded bg-yellow-400 text-black">
      <Clock size={24} />
    </div>

  </div>

  {/* Pending */}
  <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_black] rounded flex justify-between items-start">
    
    <div>
      <h4 className="text-3xl font-bold text-[#5D0CA0]">3</h4>
      <p className="text-gray-600 mt-2">Pending Tasks</p>
    </div>

    <div className="border-2 border-black p-2 rounded bg-[#5D0CA0] text-white">
      <ListTodo size={24} />
    </div>

  </div>

</div>

      {/* Recommended Internships */}
      <div className="flex flex-col gap-4">
        <h3 className="text-2xl font-bold">
          Recommended Internships
        </h3>

        <div className="bg-white border-2 border-black p-8 shadow-[4px_4px_0px_black] rounded flex flex-col gap-4">

          <h4 className="text-xl font-semibold">
            Frontend Developer Intern
          </h4>

          <p className="text-gray-600">
            TechNova • Remote • 3 Months
          </p>

          <p className="text-gray-700 text-sm">
            Work with React and modern frontend tools to build scalable user interfaces.
            Collaborate with designers and backend developers.
          </p>

          <div className="flex gap-4 mt-4">
            <Link
              to="/student/internships"
              className="bg-[#5D0CA0] text-white border-2 border-black px-6 py-2 shadow-[4px_4px_0px_black] hover:translate-y-[2px] hover:shadow-none transition rounded"
            >
              View Details
            </Link>

            <button className="border-2 border-black px-6 py-2 bg-white shadow-[4px_4px_0px_black] hover:translate-y-[2px] hover:shadow-none transition rounded">
              Save
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};