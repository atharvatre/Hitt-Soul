import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiRespone.js";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

const postUserQuestion = asyncHandler(async (req, res) => {
  const body = req.body;
  // console.log("input_value===>",input_value)
  //console.log("question===>",question)
  if (!input_value) {
    throw new ApiError(400, "Question is required");
  }
  
  const response = await fetch(process.env.LANGFLOW_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LANFLOW_BEARERR_TOKEN}`,
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  console.log("data===>",data)
  if (data.error) {
    throw new ApiError(400, data.error);
  }
  return res.status(200).json(new ApiResponse(200, data, "Answer received"));
});

const getUserLocation = asyncHandler(async (req, res) => {
  const { city } = req.params;
});

export { postUserQuestion, getUserLocation };

// return res
//         .status(200)
//         .cookie("accessToken", accessToken, options)
//         .cookie("refreshToken", refreshToken, options)
//         .json(
//             new ApiResponse(
//                 200,
//                 { user: loggedInUser, refreshToken, accessToken },
//                 "User logged in successfully"
//             )
//         );
// });

// if (!isPasswordValid) {
//     throw new ApiError(401, "Invalid credentials");
// }
