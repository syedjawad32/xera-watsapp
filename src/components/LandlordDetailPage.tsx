import React, { useState, useEffect } from "react";
import apiClient from "../services/api-client";
import { Image } from "@chakra-ui/react";
import styles from "./Landlord.module.css";
import user from "../assets/user.jpg";
import whatsapp from "../assets/whatsapp.jpg";

interface Property {
  property_id: number;
  p_number: number;
  no_room: number;
  actual_area: number | null;
  property_type: string;
  unit_no: string;
  area: string;
  building_name: string;
  master_project: string;
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
  count: number;
}

interface Props {
  selectedLandlordId: number;
}

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

const LandlordDetailPage: React.FC<Props> = ({ selectedLandlordId }) => {
  const [landlord, setLandlord] = useState<Landlord | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    let foundDesiredLandlord = false;
    let pageUrl = "/landlords-properties?page=" + currentPage;
    setLoading(true);
    function fetchLandlordDetails(pageUrl: string) {
      apiClient
        .get(pageUrl)
        .then((response) => {
          console.log("Landlords response:", response.data);
          const { results, next } = response.data;
          for (const landlord of results) {
            if (landlord.landlord_id === selectedLandlordId) {
              setLandlord(landlord);
              foundDesiredLandlord = true;
              break;
            }
          }
          if (next && !foundDesiredLandlord) {
            pageUrl = next;
            fetchLandlordDetails(pageUrl);
          }
        })
        .catch((error) => {
          console.error("Error fetching landlord details:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    fetchLandlordDetails(pageUrl);
  }, [selectedLandlordId, currentPage, apiClient]);
  // Fetch messages based on selected landlord ID
  useEffect(() => {
    const fetchMessages = async () => {
      apiClient
        .get(`/messages/?landlord_id=${selectedLandlordId}`)
        .then((response) => {
          console.log("Messages response:", response.data);
          setMessages(response.data.results);
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });
    };

    fetchMessages();
  }, [selectedLandlordId]);

  return (
    <>
      {isLoading && (
        <div className="text-center m-3">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      )}
      <div className={styles.mainContainer}>
        {landlord && (
          <div className={styles.mainContent}>
            <span className={styles.userName}>
              {" "}
              <Image
                src={user}
                boxSize="70px"
                borderRadius={50}
                overflow={"hidden"}
              ></Image>{" "}
              <h1>{landlord.full_name}</h1>
            </span>
            <div
              style={{ backgroundImage: `url(${whatsapp})` }}
              className={styles.messageContainer}
            >
              {/* <h4>Message</h4> */}
              <div>
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <span key={message.message_id}>
                      <br />
                      <br />
                      <strong>Message:</strong>{" "}
                      {message.message.split("\n").map((line, index) => (
                        <React.Fragment key={index}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                      <strong>TimeStamp:</strong>{" "}
                      {formatTimestamp(message.timestamp)}
                    </span>
                  ))
                ) : (
                  <p>No messages found.</p>
                )}
              </div>
            </div>
            <div
              style={{ backgroundImage: `url(${whatsapp})` }}
              className={styles.propertyCard}
            >
              <h6 className={styles.proDetailsBackground}>Property Details</h6>
              <p>Properties:{landlord.properties.length}</p>
              {landlord.properties.map((property) => (
                <span key={property.property_id}>
                  <strong>Property ID:</strong> {property.property_id}
                  <br />
                  <strong>Property Number:</strong> {property.p_number}
                  <br />
                  <strong>Unit Number:</strong> {property.unit_no}
                  <br />
                  <strong>Property Type:</strong> {property.property_type}
                  <br />
                  <strong>Rooms:</strong> {property.no_room}
                  <br />
                  <strong>Building name:</strong> {property.building_name}
                  <br />
                  <strong>Project:</strong> {property.project}
                  <br />
                  <strong>Master Project:</strong> {property.master_project}
                  <br />
                  <hr />
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LandlordDetailPage;
