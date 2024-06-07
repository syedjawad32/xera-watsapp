import React, { useState, useEffect } from "react";
import axios from "axios";
// import apiClient from "../services/api-client";
import { Card } from "react-bootstrap";

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
}

interface Props {
  selectedLandlordId: number;
}


const LandlordDetailPage: React.FC<Props> = ({ selectedLandlordId }) => {
  console.log("LandlordDetailPage rendered");
  const [landlord, setLandlord] = useState<Landlord | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchLandlordDetails = () => {
      axios
        .get<{ results: Landlord[] }>(
          "https://api.gurukoder.com/landlord/landlords-properties"
        )
        .then((landlordsResponse) => {
          // Find the landlord based on landlord_id
          const selectedLandlord = landlordsResponse.data.results.find(
            (landlord) => landlord.landlord_id === selectedLandlordId
          );
          // Update landlord state
          if (selectedLandlord) {
            setLandlord(selectedLandlord);
            return selectedLandlord;
          } else {
            console.error("Landlord not found");
            throw new Error("Landlord not found");
          }
        })
        .then(() => {
          // Fetch messages for the selected landlord
          return axios.get<{ results: Message[] }>(
            `https://api.gurukoder.com/landlord/messages/?landlord_id=${selectedLandlordId}`
          );
        })
        .then((messagesResponse) => {
          // Update messages state
          setMessages(messagesResponse.data.results);
        })
        .catch((error) => {
          console.error("Error fetching landlord details:", error);
        });
    };

    fetchLandlordDetails();
  }, [selectedLandlordId]);

  // Render landlord details
  return (
      <div>
      {landlord && (
        <Card>
          <Card.Body>
            <Card.Title>{landlord.full_name}</Card.Title>
            <Card.Title>Property Details</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              Properties: {landlord.properties.length}
            </Card.Subtitle>
            {landlord.properties.map((property) => (
              <Card.Text key={property.property_id}>
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
              </Card.Text>
            ))}
          </Card.Body>
          <hr />
          <Card.Body>
            <Card.Title className="messageColor">Messages</Card.Title>
            {messages.length > 0 ? (
              messages.map((message) => (
                <Card.Text key={message.message_id}>
                  <strong>TimeStamp:</strong> {message.timestamp}
                  <br />
                  <strong>Message:</strong> {message.message}
                  <br />
                </Card.Text>
              ))
            ) : (
              <p>No messages found.</p>
            )}
          </Card.Body>
        </Card>
      )}

    </div>
  );
};

export default LandlordDetailPage;
