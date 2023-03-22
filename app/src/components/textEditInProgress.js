import React from "react";
import { Skeleton } from "@mui/material";
import './textEditInProgress.css' 

const TextEditInProgress = () => {
  return (
    <div className="text-edition">
      <Skeleton
        variant="text"
        sx={{ fontSize: "1rem", width: "70%", backgroundColor: "#ffffff0f" }}
        animation="wave"
      />
      <Skeleton
        variant="text"
        sx={{ fontSize: "1rem", width: "68%", backgroundColor: "#ffffff0f" }}
        animation="wave"
      />
      <Skeleton
        variant="text"
        sx={{ fontSize: "1rem", width: "70%", backgroundColor: "#ffffff0f" }}
        animation="wave"
      />
      <Skeleton
        variant="text"
        sx={{ fontSize: "1rem", width: "23%", backgroundColor: "#ffffff0f" }}
        animation="wave"
      />
    </div>
  );
};

export default TextEditInProgress;
