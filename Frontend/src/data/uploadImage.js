export async function uploadImage(file) {
  // TODO: when the backend is ready, send the file and return the URL it gives back.
  // const formData = new FormData();
  // formData.append('image', file);
  // const { data } = await api.post('/upload', formData);
  // return data.url;
  return URL.createObjectURL(file);
}