import axios from 'axios';

const API_URL = 'http://localhost:5001'; 

export const getTickets = async () => {
  try {
    const response = await axios.get(`${API_URL}/tickets`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
};

export const getMessagesByTicketId = async (ticketId: string) => {
  try {
    const response = await fetch(`${API_URL}/tickets/${ticketId}/context`);
    if (!response.ok) {
      throw new Error(`Error fetching messages for ticket ${ticketId}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};