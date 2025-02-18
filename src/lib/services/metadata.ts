const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface MetadataItem {
  _id: string;
  name: string;
  type: string;
  createdDate: string;
  createdAt: string;
  updatedAt: string;
}

export async function getMetadata(type: string): Promise<MetadataItem[]> {
  const response = await fetch(`${BASE_URL}/metadata/type/${type}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${type} metadata`);
  }
  return response.json();
}
