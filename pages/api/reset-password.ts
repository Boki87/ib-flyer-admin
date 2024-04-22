import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
import supabaseNode from "../../lib/supabase_node";
import supabase from "../../lib/supabase";

export default withIronSessionApiRoute(resetUserPasswordRoute, sessionOptions);

async function resetUserPasswordRoute(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!req.session.user) {
    res.status(401).json({ success: false, message: "Not authenticated" });
  }

  const { user_id } = req.body;

  const { data: user, error } = await supabaseNode.auth.admin.updateUserById(
    user_id,
    {
      password: "1234567",
    },
  );
  console.log(2, error);
  res.json({
    success: true,
    error,
  });
}
