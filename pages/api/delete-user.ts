import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
import supabaseNode from "../../lib/supabase_node";
import supabase from "../../lib/supabase";

export default withIronSessionApiRoute(deleteUserRoute, sessionOptions);

async function deleteUserRoute(req: NextApiRequest, res: NextApiResponse) {
  if (!req.session.user) {
    res.status(401).json({ success: false, message: "Not authenticated" });
  }

  const { user_id, owner_id } = req.body;

  const { data: owner, error: ownerError } = await supabase
    .from("owners")
    .update({ user_id: null, is_active: false })
    .match({ id: owner_id });
  console.log(1, ownerError);
  const { data: user, error } = await supabaseNode.auth.admin.deleteUser(
    user_id
  );
  console.log(2, error);
  res.json({
    success: true,
    data: { user, owner },
    error,
  });
}
