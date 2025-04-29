import ServiceDetailPageClient from "./ServicesDetailPageClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <ServiceDetailPageClient serviceId={(await params).id} />;
}
