import React from "react";
import { useRouter } from "next/router";
import ButtonLayout from "../buttonLayout";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const TicketsButton = () => {
  const router = useRouter();

  const handleTicketsClick = () => {
    router.push("/tickets"); // Redirect to the Tickets page
  };

  return (
    <ButtonLayout
      onClick={handleTicketsClick}
      icon={
        <SupportAgentIcon
          sx={{
            width: "38px",
            height: "38px",
            top: "6px",
            left: "7px",
            color: "#FFFFFF",
          }}
        />
      }
    >
      Tickets
    </ButtonLayout>
  );
};

export default TicketsButton;
