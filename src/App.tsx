import { useState, useEffect } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Text,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { RingLoader } from "react-spinners";
import LandlordDetailPage, { Landlord } from "./components/LandlordDetailPage";
import apiClient from "./services/api-client";
import Footer from "./components/Footer";

interface AppProps {
  page: number;
}

const App = ({ page }: AppProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  // hooks
  const [data, setData] = useState<Landlord[]>([]);
  const [sortedData, setSortedData] = useState<Landlord[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [count, setCount] = useState<number | null>();
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);
  const [selectedLandlordId, setSelectedLandlordId] = useState<number | null>(
    null
  );
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(page);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc" | null;
  }>({
    key: "",
    direction: null,
  });

  // function for fetching data from api
  const fetchData = (url: string) => {
    setIsLoading(true);
    apiClient
      .get(url)
      .then((response) => {
        setData(response.data.results);
        setSortedData(response.data.results);
        setCount(response.data.count);
        setNextPageUrl(response.data.next);
        setPrevPageUrl(response.data.previous);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  };
  // Ensure count is a valid number
   const validCount = count ?? 0;

  // count total pages
  const totalPage = Math.ceil(validCount/ data.length);

  useEffect(() => {
    const storedPageIndex = localStorage.getItem("currentPageIndex");
    const initialPageIndex = storedPageIndex
      ? parseInt(storedPageIndex, 10)
      : page;
    setCurrentPageIndex(initialPageIndex);
  }, [page]);

  // storing page on local storage for get on time

  useEffect(() => {
    localStorage.setItem("currentPageIndex", currentPageIndex.toString());
  }, [currentPageIndex]);

  // initialize query params for finding currentpage when back to main page
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const page = parseInt(queryParams.get("page") || "0", 10);
    setCurrentPageIndex(page);
  }, [location.search]);

  // finding current page by nextpageurl link
  useEffect(() => {
    fetchData(`/landlords-properties/?page=${currentPageIndex + 1}`);
  }, [currentPageIndex]);

  // handle user details with specific id
  const handleViewDetails = (landlord: Landlord) => {
    setSelectedLandlordId(landlord.landlord_id);
    navigate(`/landlord/${landlord.landlord_id}?page=${currentPageIndex}`);
  };

  // initiliaze pagination segment of 5
  const pagesPerPage = 5;
  const handlePageChange = (pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < totalPage) {
      setCurrentPageIndex(pageIndex);
      // console.log(pageIndex);
    }
  };

  // handle pagination
  const handleNextPage = () => {
    if (nextPageUrl && currentPageIndex < totalPage - 5) {
      setCurrentPageIndex(currentPageIndex + 5);
      console.log(currentPageIndex + 5);
    }
    if (currentPageIndex === totalPage) {
      setCurrentPageIndex(currentPageIndex);
    }
  };

  const handlePreviousPage = () => {
    if (prevPageUrl && currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 5);
      console.log(currentPageIndex - 5);
    }
    if (currentPageIndex < 5) {
      setCurrentPageIndex(0);
    }
  };

  // function for pages segments
  const renderPageButtons = () => {
    const startIndex = currentPageIndex;
    const endIndex = Math.min(startIndex + pagesPerPage, totalPage);

    const buttons = [];
    if (nextPageUrl !== null) {
      for (let i = startIndex + 1; i < endIndex + 1; i++) {
        buttons.push(
          <Button
            size="sm"
            m={1}
            key={i}
            bg={currentPageIndex === i - 1 ? "gray.200" : "#C9AE54"}
            color={currentPageIndex === i - 1 ? "black" : "white"}
            onClick={() => handlePageChange(i - 1)}
            disabled={currentPageIndex === totalPage - 3}
          >
            {i}
          </Button>
        );
      }
    }
    return buttons;
  };

  // handle sorting
  const handleSort = (key: keyof Landlord) => {
    let direction: "asc" | "desc" | null = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sorted = [...sortedData].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setSortedData(sorted);
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Landlord) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? (
        <ChevronUpIcon />
      ) : (
        <ChevronDownIcon />
      );
    }
    return null;
  };

  // returning all values on an interface
  return (
    <>
      {/* display error if any  */}
      {error && <Text color="red.500">{error}</Text>}
      {/* display loader  */}
      <Box margin={30}>
        {isLoading && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginTop={20}
          >
            <RingLoader color="#C9AE54" />
          </Box>
        )}
        {/* while content is loading successfully display table  */}
        {!isLoading && (
          <Table variant="striped">
            <Thead
              sx={{
                bg: "#C9AE54",
                color: "white",
                th: {
                  color: "white",
                },
              }}
            >
              <Tr>
                <Th onClick={() => handleSort("landlord_id")}>
                  ID {getSortIcon("landlord_id")}
                </Th>
                <Th onClick={() => handleSort("full_name")}>
                  Name {getSortIcon("full_name")}
                </Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th onClick={() => handleSort("properties")}>
                  Properties Count {getSortIcon("properties")}
                </Th>
                <Th onClick={() => handleSort("messages_count")}>
                  Messages Count {getSortIcon("messages_count")}
                </Th>
                <Th>Details</Th>
              </Tr>
            </Thead>
            <Tbody>
              {sortedData.map((landlord, index) => (
                <Tr
                  key={landlord.landlord_id}
                  bg={index % 2 === 0 ? "#e5e7eb" : "white"}
                  borderBottom="1px solid #e5e7eb"
                  _odd={{ bg: "#e5e7eb" }}
                >
                  <Td>{landlord.landlord_id}</Td>
                  <Td>{landlord.full_name}</Td>
                  <Td>{landlord.email}</Td>
                  <Td>{landlord.phone_1}</Td>
                  <Td>{landlord.properties.length}</Td>
                  <Td>{landlord.messages_count}</Td>
                  <Td>
                    <Button
                      bg="#C9AE54"
                      color="white"
                      size="sm"
                      onClick={() => handleViewDetails(landlord)}
                    >
                      View Details
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
      {/* pass landlorddetailpage props for link with specific id  */}
      {selectedLandlordId && (
        <LandlordDetailPage
          selectedLandlordId={selectedLandlordId}
          page={page}
        />
      )}

      {/* pagintion interface  */}
      {!isLoading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          color="#C9AE54"
        >
          Page No {currentPageIndex + 1} out of {totalPage}
        </Box>
      )}
      {!isLoading && (
        <Box display="flex" justifyContent="center" m={2}>
          <Button
            bg="#C9AE54"
            color="white"
            size="sm"
            m={1}
            onClick={handlePreviousPage}
          >
            Prev Page
          </Button>
          {renderPageButtons()}
          <Button
            bg="#C9AE54"
            color="white"
            size="sm"
            m={1}
            onClick={handleNextPage}
            disabled={currentPageIndex === totalPage - 1}
          >
            Next Page
          </Button>
        </Box>
      )}
      {!isLoading && <Footer />}
    </>
  );
};

export default App;
