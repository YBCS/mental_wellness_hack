import Head from 'next/head';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Easemind</title>
        <meta name="description" content="Easemind application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>{children}</main>
    </>
  );
}
