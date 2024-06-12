// import axios from "axios";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import styles from "../src/App.module.css";
import LandlordDetailPage from "./components/LandlordDetailPage";
import { Landlord } from "./components/LandlordDetailPage";
import apiClient from "./services/api-client";
import { border } from "@chakra-ui/react";

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
    apiClient
      .get(url)
      .then((response) => {
        setData(response.data.results);
        setNextPageUrl(response.data.next);
        setPrevPageUrl(response.data.previous);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData("/landlords-properties/");
  }, []);
  const handleViewDetails = (landlord: Landlord) => {
    navigate(`/landlord/${landlord.landlord_id}`, { replace: true });
    console.log(data);
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
      {/* { loading && 
        <div className="text-center m-3">
        <div className="spinner-border text-primary" role="status">
        </div>
      </div>} */}
      {error && <p className="text text-danger">{error}</p>}
      <div className={styles.settingTable}>
        {loading && (
          <div className="text-center m-3">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        )}
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
      {!loading && (
        <div className="d-flex justify-content-center m-2">
          <button className="btn btn-primary m-1" onClick={handlePreviousPage}>
            Prev
          </button>
          <button className="btn btn-primary m-1" onClick={handleNextPage}>
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default App;
