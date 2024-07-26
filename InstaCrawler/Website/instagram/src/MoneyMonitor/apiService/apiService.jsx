import axios from "axios";

export const sendDataToDB = async ({ record_entry }) => {
  const { Type, ...rest } = record_entry;
  const data = {
    status: "record",
    record_entry: rest,
    user_id: 90260003,
    record_type: Type,
  };
  try {
    const response = await axios.post(
      "https://2h8gfybwsd.execute-api.us-east-1.amazonaws.com/MoniMonitor_ToDB",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Response from server:", response.data);
  } catch (error) {
    console.error("Error sending data:", error);
  }
};
