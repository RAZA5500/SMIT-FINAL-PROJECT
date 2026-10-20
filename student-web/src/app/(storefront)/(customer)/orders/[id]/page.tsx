export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main className="pt-24 pb-10 customer-container">
      <h1 className="section-heading">Order {id}</h1>
    </main>
  );
}
