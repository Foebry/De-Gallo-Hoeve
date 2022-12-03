import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, JWTVerifyResult, JWTVerifyOptions } from "jose";
import { HondCollection } from "./types/EntityTpes/HondTypes";

interface VerifiedToken {
  verified: boolean;
  honden: HondCollection[];
  roles: number;
  _id: string;
}

const JWT_COOKIE_NAME = "JWT";
const INDEX = process.env.DOMAIN!;
const SECRET = process.env.JWT_SECRET!;
const LOGIN = INDEX + "/login";
const UNAUTHORIZED = INDEX + "/unauthorized";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (await shouldRedirectToIndex(req, path))
    return NextResponse.redirect(INDEX);

  if (await shouldRedirectToLogin(req, path))
    return NextResponse.redirect(LOGIN);

  if (await shouldRedirectToUnAuthorized(req, path))
    return NextResponse.redirect(UNAUTHORIZED);
}

const shouldRedirectToIndex = async (req: NextRequest, path: string) => {
  const pageMatch = path.startsWith("/login") || path.startsWith("/register");
  return (await validJwtToken(req)) && pageMatch;
};

const shouldRedirectToLogin = async (req: NextRequest, path: string) => {
  return !(await validJwtToken(req)) && path.startsWith("/inschrijving");
};

const shouldRedirectToUnAuthorized = async (req: NextRequest, path: string) => {
  return !(await isAdmin(req)) && path.startsWith("/admin");
};

const validJwtToken = async (
  req: NextRequest
): Promise<boolean | JWTVerifyResult> => {
  const token = req.cookies.get(JWT_COOKIE_NAME);
  if (!token) return false;

  const secret = new TextEncoder().encode(SECRET);
  const options: JWTVerifyOptions = { algorithms: ["RS256", "HS256"] };

  const verifiedToken = await jwtVerify(token, secret, options);

  return !verifiedToken ? false : verifiedToken;
};

const isAdmin = async (req: NextRequest): Promise<boolean> => {
  const verifiedToken = await validJwtToken(req);
  if (!verifiedToken) return false;
  const token = verifiedToken as JWTVerifyResult;
  const payload = token.payload.payload as unknown as VerifiedToken;
  return payload.roles > 0;
};

export const config = {
  matcher: ["/login", "/register", "/inschrijving", "/admin/:path*"],
};
