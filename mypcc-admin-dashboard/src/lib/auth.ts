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
        async signIn({ user, account, profile }) {
            if (account?.provider === "credentials") return true;

            if (account?.provider && user.email) {
                try {
                    const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
                    if (!dbUser) {
                        await prisma.user.create({
                            data: {
                                email: user.email,
                                name: user.name || profile?.name || "New User",
                                image: user.image || (profile as any)?.picture || "",
                                role: "NORMAL_USER",
                            }
                        });
                    }
                    return true;
                } catch (error) {
                    console.error("[AUTH] Error during OAuth sign in:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (user) {
                if (account && account.provider !== "credentials" && user.email) {
                    // For Google/Facebook, fetch the DB ID and Role as it was just created/found in signIn
                    const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
                    if (dbUser) {
                        token.id = dbUser.id;
                        token.role = dbUser.role;
                    } else {
                        token.id = user.id;
                        token.role = "NORMAL_USER";
                    }
                } else {
                    // For Credentials, the ID and Role are returned directly from authorize()
                    token.id = user.id;
                    token.role = (user as any).role;
                }
                
                // Fetch subscription type to store in token
                try {
                    const sub = await prisma.subscription.findFirst({
                        where: { userId: token.id as string, status: 'ACTIVE' },
                        orderBy: { createdAt: 'desc' }
                    });
                    token.subscriptionType = sub?.type || 'FREE';
                } catch (e) {
                    token.subscriptionType = 'FREE';
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id as string;
                (session.user as any).role = token.role as string;
                (session.user as any).subscriptionType = (token.subscriptionType as string) || 'FREE';
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
