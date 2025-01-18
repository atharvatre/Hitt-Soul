import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiRespone";
dotenv.config({
  path: "./.env",
});

const postUserQuestion = asyncHandler(async (req, res) => {
  const { question } = req.body;
  if (!question) {
    throw new ApiError(400, "Question is required");
  }
  const response = await fetch(process.env.API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
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
