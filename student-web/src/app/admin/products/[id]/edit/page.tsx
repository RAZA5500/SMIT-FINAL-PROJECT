export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <main className="flex-1 p-5">Edit product {id}</main>;
}
