// import apiClient from "./services/api-client";
import axios from "axios";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";

import LandlordDetailPage from "./components/LandlordDetailPage";
import { Landlord } from "./components/LandlordDetailPage";
// import apiClient from "./services/api-client";

const App = () => {
  const navigate = useNavigate();
  const columns = [
    {
      name: "ID",
      selector: (row: Landlord) => row.landlord_id,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row: Landlord) => row.full_name,
      sortable: true,
    },
    { name: "Email", selector: (row: Landlord) => row.email },
    { name: "Phone", selector: (row: Landlord) => row.phone_1 },
    {
      name: "Properties Count",
      selector: (row: Landlord) => row.properties.length,
      sortable: true,
    },
    {
      name: "Messages Count",
      selector: (row: Landlord) => row.messages_count,
      sortable: true,
    },
    {
      name: "Details",
      cell: (row: Landlord) => (
        <button
          className="btn btn-primary m-1"
          onClick={() => handleViewDetails(row)}
        >
          View Details
        </button>
      ),
    },
  ];
  const [data, setData] = useState<Landlord[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);
  const [selectedLandlordId, setSelectedLandlordId] = useState<number | null>(
    null
  );

  const fetchData = (url: string) => {
    setLoading(true);
    axios
      .get(url)
      .then((response) => {
        setData(response.data.results);
        setNextPageUrl(response.data.next);
        setPrevPageUrl(response.data.previous);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData("https://api.gurukoder.com/landlord/landlords-properties/");
  }, []);
  const handleViewDetails = (landlord: Landlord) => {
    navigate(`/landlord/${landlord.landlord_id}`, { replace: true });
    console.log(data)
  };
  const handleNextPage = () => {
    if (nextPageUrl) {
      fetchData(nextPageUrl);
    }
  };

  const handlePreviousPage = () => {
    if (prevPageUrl) {
      fetchData(prevPageUrl);
    }
  };

  return (
    <>
      {error && <p className="text text-danger">{error}</p>}
      <div className="settingTable">
        <DataTable
          className="dataTable"
          columns={columns}
          data={data}
          selectableRows
          progressPending={loading}
        />
      </div>
      {selectedLandlordId && (
        <LandlordDetailPage selectedLandlordId={selectedLandlordId} />
      )}
      <button onClick={handlePreviousPage}>Prev</button>
      <button onClick={handleNextPage}>Next</button>
    </>
  );
};

export default App;
