import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  pages: { signIn: '/login', error: '/login' },
  callbacks: {
    jwt({ token, account }) {
      if (account?.provider && account?.providerAccountId) {
        token.appUserId = `${account.provider}:${account.providerAccountId}`;
      } else if (!token.appUserId && token.sub) {
        token.appUserId = `google:${token.sub}`;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.appUserId || token.sub || `email:${session.user.email?.toLowerCase()}`;
      }
      return session;
    },
  },
});
