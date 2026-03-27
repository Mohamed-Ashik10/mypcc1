import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import TwitterProvider from "next-auth/providers/twitter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log("[AUTH_DEBUG] Attempting login for:", credentials?.email);
                
                if (!credentials?.email || !credentials?.password) {
                    console.error("[AUTH_DEBUG] Missing credentials");
                    throw new Error("Invalid credentials");
                }

                try {
                    console.log("[AUTH_DEBUG] Connecting to Prisma...");
                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email,
                        },
                    });

                    if (!user) {
                        console.error("[AUTH_DEBUG] User not found in DB:", credentials.email);
                        throw new Error("No user found with this email");
                    }

                    console.log("[AUTH_DEBUG] Verifying password for:", user.email);
                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password || "");
                    
                    if (!isPasswordValid) {
                        console.error("[AUTH_DEBUG] Password check failed");
                        throw new Error("Invalid password");
                    }

                    console.log("[AUTH_DEBUG] Authentication Successful!");
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role
                    };
                } catch (error: any) {
                    console.error("[AUTH_DEBUG] CRITICAL ERROR during authorize:", error.message || error);
                    // Bubble up the actual error so we can see it in logs
                    throw new Error(error.message || "Database connection failure");
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID || "",
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
        }),
        TwitterProvider({
            clientId: process.env.TWITTER_CLIENT_ID || "",
            clientSecret: process.env.TWITTER_CLIENT_SECRET || "",
            version: "2.0", // opt-in to Twitter OAuth 2.0
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
            }
            return session;
        }
    },
    pages: {
        signIn: "/auth/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
