import { useEffect, useState } from "react";
import { Company } from "../Data/Interfaces/Company";
import { useCompanyRequests } from "../Functions/CompanyRequests";
import { Spinner } from "@/Components/Spinner";

const CompanyList = () => {
  const { getCompanies } = useCompanyRequests();

  const [companies, setCompanies] = useState<Company[]>();

  useEffect(() => {
    populateCompanyData();
  }, []);

  async function populateCompanyData() {
    setCompanies(await getCompanies());
  }

  const contents =
    companies === undefined ? (
      <Spinner />
    ) : (
      <div>
        {companies.map((c) => (
          <p key={c.id}>
            {c.id} {c.name}
          </p>
        ))}
      </div>
    );

  return (
    <div>
      <h1 id="tableLabel">Company List</h1>
      <p>This component demonstrates fetching data from the server.</p>
      {contents}
    </div>
  );
};

export default CompanyList;
