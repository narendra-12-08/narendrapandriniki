import Nav from "@/components/public/Nav";
import Footer from "@/components/public/Footer";
import Chatbot from "@/components/public/Chatbot";
import PageViewBeacon from "@/components/public/PageViewBeacon";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
      <Chatbot />
      <PageViewBeacon />
    </>
  );
}
