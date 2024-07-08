import { use } from "next-api-middleware";
import type { NextApiRequest, NextApiResponse } from "next";

import { allowedHttpMethods } from "../middlewares/allowed-http-methods";
import { errorHandler } from "../middlewares/error-handler";
import { authenticate } from "../helpers/authenticate";

type HandlerResponse = {
  userId?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HandlerResponse>
) {
  const { user } = await authenticate(req, res);
  res.status(200).json({ ...user });
}

export default use(allowedHttpMethods("GET"), errorHandler)(handler);
