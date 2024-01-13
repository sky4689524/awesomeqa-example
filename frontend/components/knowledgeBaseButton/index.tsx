import React from "react";
import ButtonLayout from "../buttonLayout";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";

const KnowledgeBaseButton = () => {
  const handleKnowledgeBaseClick = () => {
    console.log("Knowledge Base Clicked");
  };

  return (
    <ButtonLayout
      onClick={handleKnowledgeBaseClick}
      icon={
        <LibraryBooksOutlinedIcon
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
      Knowledge Base
    </ButtonLayout>
  );
};

export default KnowledgeBaseButton;
