const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function handleResponse(response) {
  let data;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message || `Erreur HTTP : ${response.status}`
    );
  }

  return data;
}

export async function getProducts(search = "") {
  const url = search
    ? `${API_URL}/produits?search=${encodeURIComponent(search)}`
    : `${API_URL}/produits`;

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  return handleResponse(response);
}

export async function getProductById(id) {
  const response = await fetch(`${API_URL}/produits/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  return handleResponse(response);
}

export async function createProduct(product) {
  const response = await fetch(`${API_URL}/produits`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  return handleResponse(response);
}

export async function updateProduct(id, product) {
  const response = await fetch(`${API_URL}/produits/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  return handleResponse(response);
}

export async function deleteProduct(id) {
  const response = await fetch(`${API_URL}/produits/${id}`, {
    method: "DELETE",
  });

  return handleResponse(response);
}