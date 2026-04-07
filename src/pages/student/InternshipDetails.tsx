import { Link, useParams } from "react-router-dom";
import { MapPin, Clock, ArrowLeft, Heart, AlertCircle, Loader } from "lucide-react";
import ApplyModal from "../../components/ApplyModal";
import { useState } from "react";
import { internshipService, companyService } from "../../api";
import { useAsyncData } from "../../hooks/useAsyncData";
import useFavorites from "../../hooks/useFavorites";

export const InternshipDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [openApply, setOpenApply] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const { isFavorite, toggle } = useFavorites();
  
  // Fetch internship details
  const { data: internship, loading: loadingInternship, error: errorInternship } = useAsyncData(
    () => internshipService.getInternship(id!),
    [id]
  );

  // Fetch company details
  const { data: company, loading: loadingCompany } = useAsyncData(
    () => internship?.companyId ? companyService.getCompany(internship.companyId) : Promise.reject('No company ID'),
    [internship?.companyId]
  );

  if (loadingInternship) {
    return (
      <div className="flex flex-col gap-8 px-20 py-6 min-h-screen">
        <Link
          to="/student/internships"
          className="w-fit border-2 border-black px-4 py-2 bg-white shadow-[4px_4px_0px_black] rounded hover:translate-y-[2px] hover:shadow-none transition flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Internships
        </Link>
        <div className="flex items-center justify-center gap-3">
          <Loader className="animate-spin" size={24} />
          <p className="text-lg">Loading internship details...</p>
        </div>
      </div>
    );
  }

  if (errorInternship || !internship) {
    return (
      <div className="flex flex-col gap-8 px-20 py-6">
        <Link
          to="/student/internships"
          className="w-fit border-2 border-black px-4 py-2 bg-white shadow-[4px_4px_0px_black] rounded flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
        <div className="bg-red-50 border-2 border-red-300 p-6 rounded flex gap-4 items-start">
          <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
          <div>
            <h3 className="font-bold text-red-600">Error loading internship</h3>
            <p className="text-gray-700 mt-2">{errorInternship?.message || 'Internship not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const internshipId = internship.id;
  return (
    <div className="flex flex-col gap-8 px-20 py-6">

      {/* Back Button */}
      <Link
        to="/student/internships"
        className="w-fit border-2 border-black px-4 py-2 bg-white shadow-[4px_4px_0px_black] rounded hover:translate-y-[2px] hover:shadow-none transition flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        Back to Internships
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 flex flex-col gap-8">

          {/* Header Card */}
          <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_black] rounded flex gap-6 items-center">

            <div className="w-20 h-20 border-2 border-black rounded-lg flex items-center justify-center bg-gray-100 text-3xl">
              {company?.logoUrl ? (
                <img src={company.logoUrl} alt={company.companyName} className="w-full h-full object-cover rounded" />
              ) : (
                '💼'
              )}
            </div>

            <div>
              <h2 className="text-3xl font-bold">
                {internship.title}
              </h2>

              <p className="text-gray-600 mt-1">
                {company?.companyName || (loadingCompany ? 'Loading...' : 'Company')}
              </p>

              <div className="flex gap-4 mt-3 flex-wrap">

                <span className="flex items-center gap-1 text-sm border border-black px-3 py-1 rounded-full bg-gray-100">
                  <MapPin size={14} />
                  {company?.headquarters || 'Location TBA'}
                </span>

                <span className="flex items-center gap-1 text-sm border border-black px-3 py-1 rounded-full bg-gray-100">
                  <Clock size={14} />
                  {internship.startDate && internship.endDate 
                    ? `${Math.ceil((new Date(internship.endDate).getTime() - new Date(internship.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} months`
                    : 'Duration TBA'
                  }
                </span>

              </div>
              
              <div className="flex gap-4 mt-4 flex-wrap">
                <Link
                  to={`/student/my-internship?internshipId=${internship.id}`}
                  className="border-2 border-black px-6 py-2 bg-white shadow-[4px_4px_0px_black] rounded hover:translate-y-[2px] hover:shadow-none transition"
                >
                  Open in My internship
                </Link>
                <Link
                  to={`/student/company-profile/${internship.companyId}`}
                  className="bg-[#5D0CA0] text-white border-2 border-black px-6 py-2 shadow-[4px_4px_0px_black] rounded hover:translate-y-[2px] hover:shadow-none transition"
                >
                  About Company
                </Link>

                <button
                  type="button"
                  onClick={() => toggle(internshipId)}
                  className={`flex items-center gap-2 border-2 border-black px-4 py-2 rounded transition ${isFavorite(internshipId) ? 'bg-red-500 text-white' : 'bg-white'}`}
                >
                  <Heart size={18} /> {isFavorite(internshipId) ? 'Saved' : 'Save'}
                </button>

              </div>
            </div>
          </div>

          {/* About Role */}
          <div className="bg-white border-2 border-black p-8 shadow-[6px_6px_0px_black] rounded flex flex-col gap-6">

            <div>
              <h3 className="text-xl font-bold mb-3">
                About the Role
              </h3>

              <p className="text-gray-700 leading-relaxed">
                {internship.description}
              </p>
            </div>

            {/* Requirements */}
            <div>
              <h4 className="text-lg font-semibold mb-3">
                Requirements
              </h4>

              <div className="flex gap-3 flex-wrap">
                {internship.requirements ? internship.requirements.split(',').map((req: string, idx: number) => (
                  <span
                    key={idx}
                    className="bg-[#5D0CA0] text-white border-2 border-black px-4 py-1 rounded shadow-[3px_3px_0px_black] text-sm"
                  >
                    {req.trim()}
                  </span>
                )) : (
                  <p className="text-gray-500">No specific requirements listed</p>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h4 className="text-lg font-semibold mb-3">
                Timeline
              </h4>

              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="font-semibold">{internship.startDate ? new Date(internship.startDate).toLocaleDateString() : 'TBA'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">End Date</p>
                  <p className="font-semibold">{internship.endDate ? new Date(internship.endDate).toLocaleDateString() : 'TBA'}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_black] rounded flex flex-col gap-6 h-fit">

          <h3 className="text-xl font-bold">
            Company Info
          </h3>

          {loadingCompany ? (
            <div className="flex items-center gap-2">
              <Loader className="animate-spin" size={16} />
              <p>Loading company info...</p>
            </div>
          ) : (
            <>
              {/* Industry */}
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  INDUSTRY
                </p>
                <div className="border border-black px-4 py-2 rounded bg-gray-100">
                  {company?.industry || 'N/A'}
                </div>
              </div>

              {/* Company Size */}
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  COMPANY SIZE
                </p>
                <div className="border border-black px-4 py-2 rounded bg-gray-100">
                  {company?.companySize || 'N/A'}
                </div>
              </div>

              {/* Founded Year */}
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  FOUNDED
                </p>
                <div className="border border-black px-4 py-2 rounded bg-gray-100">
                  {company?.foundedYear || 'N/A'}
                </div>
              </div>

              {/* Website */}
              {company?.websiteUrl && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    WEBSITE
                  </p>
                  <a 
                    href={company.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#5D0CA0] underline break-all"
                  >
                    {company.websiteUrl}
                  </a>
                </div>
              )}
            </>
          )}

          {/* Apply Button */}
          <button
            onClick={() => setOpenApply(true)}
            className="mt-4 bg-[#5D0CA0] text-white border-2 border-black px-6 py-3 shadow-[4px_4px_0px_black] rounded hover:translate-y-[2px] hover:shadow-none transition"
          >
            Apply Now
          </button>

          {successMsg && (
            <div className="mt-3 bg-green-500 text-white px-3 py-2 rounded text-sm">
              {successMsg}
            </div>
          )}

          <ApplyModal
            open={openApply}
            title={internship.title}
            onClose={() => setOpenApply(false)}
            onSubmit={async (coverLetter: string) => {
              console.log("Applying to internship:", internship.id, "with cover letter");
              // Здесь можно добавить API call для submission
              await new Promise((res) => setTimeout(res, 700));
              setSuccessMsg("Application submitted successfully!");
              setTimeout(() => setSuccessMsg(""), 3000);
            }}
          />

        </div>

      </div>
    </div>
  );
};