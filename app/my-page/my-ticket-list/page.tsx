import { Metadata } from "next";
import MyTicktListPage from "app/my-page/my-ticket-list/my-ticket-list-page";

export const metadata: Metadata = {
  title: "My Tickets",
};

export default function Page() {
  return <MyTicktListPage />;
}
