import json
from typing import Optional, List

# TicketRepository class to handle ticket data and message caching
class TicketRepository:
    def __init__(self, filepath: str):
        # Load ticket data from a JSON file
        with open(filepath) as json_file:
            self.data = json.load(json_file)
        
        # Initialize a cache to store context messages
        self.context_cache = {}

    # Method to get a list of tickets, optionally with a limit
    def get_tickets(self, limit: Optional[int] = None) -> list[dict]:
        # Filter tickets to only include those with an "open" status
        tickets = [ticket for ticket in self.data["tickets"] if ticket["status"] == "open"]
        
        # Sort tickets by timestamp
        sorted_tickets = sorted(tickets, key=lambda x: x["timestamp"])
        return sorted_tickets[:limit]

    # Method to get a specific ticket by its ID
    def get_ticket_by_id(self, ticket_id: str) -> Optional[dict]:
        # Find and return the ticket with the specified ID
        tickets = self.data["tickets"]
        return next((ticket for ticket in tickets if ticket["id"] == ticket_id), None)

    # Method to get messages from a list of message IDs
    def get_messages_from_ids(self, message_ids: List[str]) -> List[dict]:
        # Use a tuple of message IDs as a cache key
        message_ids_key = tuple(message_ids)

        # Return cached messages if they exist
        if message_ids_key in self.context_cache:
            return self.context_cache[message_ids_key]

        # Otherwise, find and cache the messages
        messages = self.data["messages"]
        result = [message for message in messages if message['id'] in message_ids]
        self.context_cache[message_ids_key] = result
        return result

    # Method to get a specific message by its ID
    def get_message_by_id(self, message_id: str) -> Optional[dict]:
        # Find and return the message with the specified ID
        messages = self.data["messages"]
        return next((message for message in messages if message["id"] == message_id), None)
