from app.repositories.ticket_repository import TicketRepository
import uvicorn
from fastapi import Depends, FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS configuration to allow requests from specific origins (frontend)
origins = [
    "http://localhost:3002", 
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


TICKET_FILEPATH = "../data/awesome_tickets.json"
ticket_repository = TicketRepository(filepath=TICKET_FILEPATH)

# Set to store IDs of removed tickets to prevent them from being shown again
removed_ticket_ids = set()

@app.get("/healthz")
async def root():
    return "OK"

# Endpoint to get a list of tickets, excluding removed tickets
@app.get("/tickets")
async def get_tickets(
    limit: int = 220, 
    ticket_repository: TicketRepository = Depends(lambda: ticket_repository),
):
    tickets = ticket_repository.get_tickets(limit)
    
    # Retrieve tickets and filter out those that have been removed
    filtered_tickets = [ticket for ticket in tickets if ticket["id"] not in removed_ticket_ids]
    return JSONResponse(filtered_tickets, status_code=200)

# Endpoint to get the context messages of a specific ticket
@app.get("/tickets/{ticket_id}/context")
async def get_ticket_context(ticket_id: str):
    # Find the ticket by ID and return an error if not found
    ticket = next((t for t in ticket_repository.get_tickets() if t["id"] == ticket_id), None)
    if not ticket:
        return {"error": "Ticket not found"}, 404

    # Retrieve context messages for the ticket
    context_message_ids = ticket.get("context_messages", [])
    context_messages = ticket_repository.get_messages_from_ids(context_message_ids)
    return context_messages

# Endpoint to get a specific context message of a ticket
@app.get("/tickets/{ticket_id}/context/{message_id}")
async def get_specific_context_message(ticket_id: str, message_id: str):
    # Retrieve the ticket and return an error if not found
    ticket = ticket_repository.get_ticket_by_id(ticket_id)
    if not ticket:
        return {"error": "Ticket not found"}, 404

    # Attempt to get the message from the cache, or fetch it if not cached
    context_message_ids = ticket.get("context_messages", [])
    cached_messages = ticket_repository.context_cache.get(tuple(context_message_ids))
    if cached_messages:
        message = next((msg for msg in cached_messages if msg["id"] == message_id), None)
        if not message:
            return {"error": "Message not found in context"}, 404
        return message

    # Fetch and cache the messages if not in the cache
    context_messages = ticket_repository.get_messages_from_ids(context_message_ids)
    message = next((msg for msg in context_messages if msg["id"] == message_id), None)
    if not message:
        return {"error": "Message not found"}, 404

    return message

# Endpoint to remove a ticket by its ID
@app.post("/tickets/{ticket_id}/remove")
async def remove_ticket(ticket_id: str):
    global removed_ticket_ids
    # Find the ticket and add its
    ticket = ticket_repository.get_ticket_by_id(ticket_id)
    if not ticket:
        return {"error": "Ticket not found"}, 404
    removed_ticket_ids.add(ticket_id)
    return {"message": "Ticket removed successfully"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=5001, reload=True)
