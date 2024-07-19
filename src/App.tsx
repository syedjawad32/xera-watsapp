import { useState, useEffect } from "react";
import {
  Image,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Heading,
  Flex,
  Text,
  Button,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { RingLoader } from "react-spinners";
import Modal from "react-bootstrap/Modal";
import styles from "./App.module.css";
import user from "./assets/user-profile.jpg";
import whatsapp from "./assets/whatsapp.jpeg";
import logo from "./assets/logo.png-removebg-preview.png";
import { Landlord, Message } from "./components/LandlordDetailPage";
import apiClient from "./services/api-client";
import Footer from "./components/Footer";

interface AppProps {
  page: number;
}
const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

const App = ({ page }: AppProps) => {
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
  const [landlord, setLandlord] = useState<Landlord | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [fullscreen, setFullscreen] = useState<string | true | undefined>(
    undefined
  );
  const [show, setShow] = useState<boolean>(false);
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
  const totalPage = Math.ceil(validCount / data.length);

  // finding current page by nextpageurl link
  useEffect(() => {
    fetchData(`/landlords-properties/?page=${currentPageIndex + 1}`);
  }, [currentPageIndex]);

  useEffect(() => {
    const fetchLandlordDetails = async () => {
      try {
        const messagesResponse = await apiClient.get(
          `/messages/?landlord_id=${selectedLandlordId}`
        );
        // console.log("Messages response:", messagesResponse.data);
        setMessages(messagesResponse.data.results);

        const landlordResponse = await apiClient.get(
          `/landlords-properties/?landlord_id=${selectedLandlordId}`
        );

        // Set the landlord to the first item if the results array is not empty
        if (landlordResponse.data.results.length > 0) {
          setLandlord(landlordResponse.data.results[0]);
          // console.log("landlord properties response:", landlordResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchLandlordDetails();
  }, [selectedLandlordId]);

  const handleViewDetails = (landlord: Landlord) => {
    setSelectedLandlordId(landlord.landlord_id);
    setLandlord(landlord);
    handleShow(true);
  };

  const handleShow = (breakpoint: boolean) => {
    setFullscreen(breakpoint ? true : undefined); // Map boolean to `true` or `undefined`
    setShow(true);
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
                      size="sm"
                      bg="#C9AE54"
                      color="white"
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
      {show && (
        <Modal
          show={show}
          fullscreen={fullscreen}
          onHide={() => setShow(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <Image
                src={logo}
                width=""
                height="55px"
                marginLeft={5}
                marginTop={1}
                marginBottom={1}
                alt="Logo"
              />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
            <div className={styles.mainContainer}>
              {landlord && (
                <div className={styles.mainContent}>
                  <span className={styles.userName}>
                    <Image
                      src={user}
                      boxSize="70px"
                      borderRadius={50}
                      overflow="hidden"
                      marginRight={2}
                    />
                    <h2 className={styles.userHeading}>{landlord.full_name}</h2>
                  </span>

                  {/* <Card mb={4}>
                    <CardHeader boxShadow="0px 3px 4px rgba(0, 0, 0, 0.21)"> */}
                  <Heading size="md" className={styles.userDetail}>
                    No of Properties:{" "}
                    {landlord.properties ? landlord.properties.length : 0}
                  </Heading>
                  {/* </CardHeader>
                  </Card> */}

                  {landlord.properties && landlord.properties.length > 0 && (
                    <Table
                      // mt={4}
                      className={styles.userPropertyTable}
                      variant="striped"
                    >
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
                          <Th>Property ID</Th>
                          <Th>Property Number</Th>
                          <Th>Unit Number</Th>
                          <Th>Property Type</Th>
                          <Th>Rooms</Th>
                          <Th>Building Name</Th>
                          <Th>Project</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {landlord.properties.map((property, index) => (
                          <Tr
                            key={property.property_id}
                            bg={index % 2 === 0 ? "#e5e7eb" : "white"}
                            borderBottom="1px solid #e5e7eb"
                          >
                            <Td>{property.property_id}</Td>
                            <Td>{property.p_number}</Td>
                            <Td>{property.unit_no}</Td>
                            <Td>{property.property_type}</Td>
                            <Td>{property.no_room}</Td>
                            <Td>{property.building_name}</Td>
                            <Td>{property.project}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  )}

                  {/* <Card mt={4}>
                    <CardHeader boxShadow="0px 3px 4px rgba(0, 0, 0, 0.21)"> */}
                  <Heading size="md" className={styles.userDetail}>
                    User Messages
                  </Heading>
                  {/* </CardHeader>
                  </Card> */}

                  <Box
                    backgroundImage={`url(${whatsapp})`}
                    borderRadius="md"
                    className={styles.messageContainer}
                  >
                    {messages.length > 0 ? (
                      <Box>
                        <h5 color="gray.500">Message</h5>
                        {messages.map((message) => (
                          <Box
                            key={message.message_id}
                            bg="#d9fdd3"
                            p={4}
                            mb={4}
                            borderRadius="md"
                            boxShadow="sm"
                          >
                            <Flex direction="column">
                              <Text whiteSpace="pre-wrap">
                                {message.message}
                              </Text>
                              <Text mt={2} fontSize="sm" color="gray.500">
                                {formatTimestamp(message.timestamp)}
                              </Text>
                            </Flex>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <p>No messages found.</p>
                    )}
                  </Box>
                </div>
              )}
            </div>
            {/* {!isLoading && <Footer />} */}
          </Modal.Body>
        </Modal>
      )}
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
        <Box display="flex" justifyContent="center" mt={4}>
          <Button
            size="sm"
            m={1}
            bg="#C9AE54"
            color="white"
            onClick={handlePreviousPage}
            disabled={!prevPageUrl}
          >
            Previous Page
          </Button>
          {renderPageButtons()}
          <Button
            size="sm"
            m={1}
            bg="#C9AE54"
            color="white"
            onClick={handleNextPage}
            disabled={!nextPageUrl}
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
