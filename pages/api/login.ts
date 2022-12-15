import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";

export default withIronSessionApiRoute(loginRoute, sessionOptions);

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;
  if (email === "ibproduct@gmail.com" && password === "Srbija_2022") {
    const user = {
      email,
      is_admin: true,
    };
    req.session.user = user;
    await req.session.save();
    res.json(user);
  } else {
    res.status(401).json({ message: "Incorrect login credentials" });
  }
}
