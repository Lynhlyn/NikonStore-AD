import POSPage from "@/modules/Pos/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Bán hàng tại quầy',
};

export default async function PosPage() {
  return <POSPage />;
}

