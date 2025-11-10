export const fetchImages = async (serverUrl) => {
  const res = await fetch(`${serverUrl}/images`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  
  const data = await res.json();
  
  if (data.images && Array.isArray(data.images)) {
    return data.images;
  } else {
    throw new Error("Beklenmeyen veri formatı");
  }
};

