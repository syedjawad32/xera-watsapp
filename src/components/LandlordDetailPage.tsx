import React, { useState, useEffect } from "react";
import {
  Image,
  Card,
  CardHeader,
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
} from "@chakra-ui/react";
import { RingLoader } from "react-spinners";
import apiClient from "../services/api-client";
import styles from "./Landlord.module.css";
import Footer from "./Footer";
import user from "../assets/user-profile.jpg";
import whatsapp from "../assets/whatsapp.jpeg";

interface Property {
  property_id: number;
  p_number: number;
  no_room: number;
  property_type: string;
  unit_no: string;
  area: string;
  building_name: string;
  project: string;
  state: string;
}

interface Message {
  message_id: number;
  message: string;
  timestamp: string;
  landlord: number;
}

export interface Landlord {
  landlord_id: number;
  full_name: string;
  email: string;
  phone_1: string;
  messages_count: number;
  properties: Property[];
}

interface Props {
  selectedLandlordId: number;
  page: number;
}

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

const LandlordDetailPage: React.FC<Props> = ({ selectedLandlordId }) => {
  const [landlord, setLandlord] = useState<Landlord | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLandlordDetails = async () => {
      setLoading(true);
      try {
        const messagesResponse = await apiClient.get(
          `/messages/?landlord_id=${selectedLandlordId}`
        );
        console.log("Messages response:", messagesResponse.data);
        setMessages(messagesResponse.data.results);

        const landlordResponse = await apiClient.get(
          `/landlords-properties/?landlord_id=${selectedLandlordId}`
        );
        console.log("landlord properties response:", landlordResponse.data);

        // Set the landlord to the first item if the results array is not empty
        if (landlordResponse.data.results.length > 0) {
          setLandlord(landlordResponse.data.results[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLandlordDetails();
  }, [selectedLandlordId]);

  return (
    <>
      {isLoading && (
       <Box
       display='flex'
       justifyContent='center'
       alignItems='center'
       marginTop={20}
       >
        <RingLoader 
        color='#C9AE54' />
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

            <Card mb={4}>
              <CardHeader boxShadow="0px 3px 4px rgba(0, 0, 0, 0.21)">
                <Heading size="md" className={styles.userDetail}>
                  No of Properties:{" "}
                  {landlord.properties ? landlord.properties.length : 0}
                </Heading>
              </CardHeader>
            </Card>

            {landlord.properties && landlord.properties.length > 0 && (
              <Table mt={4} className={styles.userPropertyTable} variant="simple">
                <Thead>
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

            <Card mt={4}>
              <CardHeader boxShadow="0px 3px 4px rgba(0, 0, 0, 0.21)">
                <Heading size="md" className={styles.userDetail}>
                  User Messages
                </Heading>
              </CardHeader>
            </Card>

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
                        <Text whiteSpace="pre-wrap">{message.message}</Text>
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
      {!isLoading && <Footer></Footer>}
    </>
  );
};

export default LandlordDetailPage;
