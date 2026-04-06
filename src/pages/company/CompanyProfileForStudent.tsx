import { Building2, Tag, MapPin, Globe, Users, Calendar, Loader, AlertCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useAsyncData } from "../../hooks/useAsyncData";
import { companyService, internshipService } from "../../api";

export const CompanyProfileForStudent = () => {
  const { companyId } = useParams<{ companyId: string }>();

  const { data: company, loading, error } = useAsyncData(
    () => companyService.getCompany(companyId!),
    [companyId]
  );

  const { data: internshipsData } = useAsyncData(
    () =>
      companyId
        ? internshipService.listInternships(companyId, 50, 0)
        : Promise.reject("no id"),
    [companyId]
  );

  if (!companyId) {
    return <p className="px-20 py-10">Missing company id.</p>;
  }

  if (loading) {
    return (
      <div className="px-20 py-10 flex items-center gap-3">
        <Loader className="animate-spin" />
        Loading company…
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="px-20 py-10">
        <div className="bg-red-50 border-2 border-red-300 p-6 rounded flex gap-3">
          <AlertCircle className="text-red-600 shrink-0" />
          <p>{error?.message ?? "Company not found"}</p>
        </div>
        <Link to="/student/internships" className="mt-4 inline-block underline">
          Back to internships
        </Link>
      </div>
    );
  }

  const items = internshipsData?.items ?? [];

  return (
    <div className="flex flex-col gap-10">
      <div className="relative w-full">
        <div className="h-48 bg-[#EDE7FF] border-b-2 border-black" />
        <div className="px-20 -mt-24 relative z-10">
          <div className="bg-white border-2 border-black shadow-[6px_6px_0px_black] rounded p-8 flex items-center gap-8">
            <div className="w-28 h-28 bg-[#EDE7FF] border-2 border-black rounded flex items-center justify-center shadow-[4px_4px_0px_black] overflow-hidden">
              {company.logoUrl ? (
                <img src={company.logoUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <Building2 size={40} />
              )}
            </div>

            <div className="flex flex-col gap-4 flex-1">
              <h2 className="text-3xl font-bold">{company.companyName}</h2>
              <p className="text-gray-600">{company.industry}</p>
              <div className="flex gap-6 text-[#5D0CA0]">
                <Tag size={18} />
                <MapPin size={18} />
                <Globe size={18} />
              </div>
              <Link
                to="/student/internships"
                className="bg-[#5D0CA0] text-white border-2 border-black px-6 py-2 shadow-[4px_4px_0px_black] rounded w-fit"
              >
                View all internships
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="px-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <Card title="ABOUT THE COMPANY">
            <p className="text-gray-700 whitespace-pre-wrap">{company.description || "No description."}</p>
          </Card>

          <Card title="ACTIVE INTERNSHIPS">
            {items.length === 0 ? (
              <p className="text-gray-600">No published internships yet.</p>
            ) : (
              <ul className="flex flex-col gap-4">
                {items.map((i) => (
                  <li key={i.id} className="border-2 border-black p-4 rounded">
                    <Link
                      to={`/student/internships/${i.id}`}
                      className="font-bold text-[#5D0CA0] hover:underline"
                    >
                      {i.title}
                    </Link>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">{i.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="FOCUS AREAS">
            <p>{(company.focusAreas ?? []).join(", ") || "—"}</p>
          </Card>
        </div>

        <div>
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_black] rounded p-6 flex flex-col gap-4">
            <h3 className="font-bold border-b border-black pb-3">COMPANY DETAILS</h3>
            <DetailRow label="Industry" value={company.industry} icon={Tag} />
            <DetailRow label="Size" value={company.companySize} icon={Users} />
            <DetailRow label="Founded" value={company.foundedYear != null ? String(company.foundedYear) : "—"} icon={Calendar} />
            <DetailRow label="Headquarters" value={company.headquarters} icon={MapPin} />
            {company.websiteUrl && (
              <a
                href={company.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#5D0CA0] underline break-all flex items-center gap-2"
              >
                <Globe size={16} /> Website
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white border-2 border-black shadow-[4px_4px_0px_black] rounded p-8">
    <h3 className="font-bold border-b border-black pb-3 mb-6">{title}</h3>
    {children}
  </div>
);

function DetailRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-gray-200 pb-3">
      <Icon size={16} className="text-[#5D0CA0] mt-1 shrink-0" />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

export default CompanyProfileForStudent;
