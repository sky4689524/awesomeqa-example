import React from "react";
import ButtonLayout from "../buttonLayout";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
const FAQInsightsButton = () => {
  const handleFAQInsightsClick = () => {
    console.log("FAQ Insights Clicked");
  };

  return (
    <ButtonLayout
      onClick={handleFAQInsightsClick}
      icon={
        <LightbulbOutlinedIcon
          sx={{
            width: "38px",
            height: "38px",
            top: "6px",
            left: "7px",
            color: "#FFFFFF"
          }}
        />
      }
    >
      FAQ Insights
    </ButtonLayout>
  );
};

export default FAQInsightsButton;
