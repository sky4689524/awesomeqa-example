import React, { useEffect, useState } from "react";
import { // Importing necessary components and hooks from Material-UI and Next.js
  Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Pagination, Stack,
  Modal, Button
} from "@mui/material";
import { useRouter } from "next/router";
import { getTickets, getMessagesByTicketId } from "../../service/ticketService";

const TicketsPage = () => {
  const [tickets, setTickets] = useState([]);  // Stores ticket data
  const [currentPage, setCurrentPage] = useState(1); // Manages current page for pagination
  const [messages, setMessages] = useState([]);  // Stores message details for selected tickets
  const [showMessagesModal, setShowMessagesModal] = useState(false);  // Controls visibility of the message modal
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);// Tracks the current message being viewed in the modal
  const rowsPerPage = 10; // Number of tickets displayed per page
  const router = useRouter();

  // Function to handle ticket row click, loading message details
  const handleRowClick = async (ticketId: string) => {
    try {
      const fetchedMessages = await getMessagesByTicketId(ticketId);
      setMessages(fetchedMessages);
      setCurrentMessageIndex(0); 
      setShowMessagesModal(true);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Function to handle pagination change
  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setCurrentPage(newPage);
  };

  // Function to navigate to the next message
  const handleNextMessage = () => {
    if (currentMessageIndex < messages.length - 1) {
      setCurrentMessageIndex(currentMessageIndex + 1);
    }
  };

  // Function to navigate to the previous message
  const handlePreviousMessage = () => {
    if (currentMessageIndex > 0) {
      setCurrentMessageIndex(currentMessageIndex - 1);
    }
  };

  // Function to remove a ticket
  const handleRemoveTicket = async (
    event: React.MouseEvent,
    ticketId: string
  ) => {
    event.stopPropagation();

    try {
      const response = await fetch(
        `http://localhost:5001/tickets/${ticketId}/remove`,
        {
          method: "POST",
        }
      );
      if (response.ok) {
        // Update the ticket list and re-sort after removal
        const updatedTickets = tickets.filter(
          (ticket) => ticket.id !== ticketId
        );
        updatedTickets.sort((a, b) => {
          return (
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
        });
        setTickets(updatedTickets);
      } else {
        console.error("Error removing ticket:", await response.json());
      }
    } catch (error) {
      console.error("Error removing ticket:", error);
    }
  };

  // Function to open the message URL in a new tab
  const openMessageUrl = (url: string) => {
    window.open(url, "_blank");
  };

  // Function to navigate back to the home
  const handleHomeClick = () => {
    router.push("/home");
  };

  // Fetches ticket data on component mount
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const fetchedTickets = await getTickets();
        setTickets(fetchedTickets);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, []);

  // JSX for rendering the Tickets page
  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          mt: 15,
          mb: 15,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#90caf9",
            width: "30%",
            marginBottom: "30px",
          }} 
          onClick={handleHomeClick}
        >
          Home
        </Button>
        <TableContainer
          component={Paper}
          sx={{
            width: "70%",
            maxHeight: "400px",
            overflow: "auto",
            margin: "auto",
          }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Ticket ID</TableCell>
                <TableCell align="center">Time</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets
                .slice(
                  (currentPage - 1) * rowsPerPage,
                  currentPage * rowsPerPage
                )
                .map((ticket) => (
                  <TableRow
                    key={ticket.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      cursor: "pointer",
                      "&:hover": {
                        background: "#302F36",
                      },
                    }}
                    onClick={() => handleRowClick(ticket.id)}
                  >
                    <TableCell align="center" component="th" scope="row">
                      {ticket.id}
                    </TableCell>
                    <TableCell align="center">
                      {ticket.timestamp.split(".")[0]}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        onClick={(event) =>
                          handleRemoveTicket(event, ticket.id)
                        }
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack spacing={2} sx={{ pt: 2, alignItems: "center" }}>
          <Pagination
            count={Math.ceil(tickets.length / rowsPerPage)}
            page={currentPage}
            onChange={handleChangePage}
            color="primary"
          />
        </Stack>
      </Box>
      <Modal
        open={showMessagesModal}
        onClose={() => setShowMessagesModal(false)}
        aria-labelledby="messages-modal-title"
        aria-describedby="messages-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "30%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
              alignItems: "center",
            }}
          >
            <h2 style={{ margin: 0 }}>Message</h2>
            <Box>
              <Button onClick={() => setShowMessagesModal(false)}>Close</Button>
            </Box>
          </Box>
          {messages.length > 0 ? (
            <>
              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell
                        sx={{
                          borderRight: 1,
                          borderColor: "divider",
                          padding: "6px",
                        }}
                      >
                        Name
                      </TableCell>
                      <TableCell sx={{ padding: "6px" }}>
                        {messages[currentMessageIndex].author.nickname}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{
                          borderRight: 1,
                          borderColor: "divider",
                          padding: "6px",
                        }}
                      >
                        Time
                      </TableCell>
                      <TableCell sx={{ padding: "6px" }}>
                        {
                          messages[currentMessageIndex].timestamp_insert.split(
                            "."
                          )[0]
                        }
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{
                          borderRight: 1,
                          borderColor: "divider",
                          padding: "6px",
                        }}
                      >
                        Message
                      </TableCell>
                      <TableCell sx={{ padding: "6px" }}>
                        <Button
                          sx={{ padding: 0, minWidth: 0 }}
                          onClick={() =>
                            openMessageUrl(
                              messages[currentMessageIndex].msg_url
                            )
                          }
                        >
                          Link
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ my: 2, ml: 1 }}>
                <p>{messages[currentMessageIndex].content}</p>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
              >
                <Button
                  onClick={handlePreviousMessage}
                  disabled={currentMessageIndex === 0}
                >
                  Previous
                </Button>
                <Button
                  onClick={handleNextMessage}
                  disabled={currentMessageIndex === messages.length - 1}
                >
                  Next
                </Button>
              </Box>
            </>
          ) : (
            <p>There are no messages from this ticket.</p>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default TicketsPage;
