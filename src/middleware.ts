import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/login" },
});

export const config = {
  matcher: [
    "/onboarding/:path*",
    "/dashboard/:path*",
    "/studio/:path*",
    "/calendar/:path*",
    "/analytics/:path*",
    "/deals/:path*",
    "/chat/:path*",
    "/connections/:path*",
    "/settings/:path*",
  ],
};
