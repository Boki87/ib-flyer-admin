import { IronSessionOptions } from "iron-session";
import { User } from "../types/User";

export const sessionOptions: IronSessionOptions = {
  password: "ibflyersecretcookiepassword123dsfasfsfqwerqwrqwrfsdfsadfsreqw",
  cookieName: "ib-flyer-cookie",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

declare module "iron-session" {
  interface IronSessionData {
    user?: User;
  }
}
