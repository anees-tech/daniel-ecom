import React from "react";

function Page({ params }: { params: { productId: string } }) {
  return <div>Page{params.productId}</div>;
}

export default Page;
