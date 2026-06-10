import api from "./api";

export const getRoadmap = async (company) => {
  const response = await api.get(`/dsa/roadmap?company=${company}`);
  return response.data;
};

export const updateProgress = async (problemId, data) => {
  const response = await api.patch(`/dsa/progress/${problemId}`, data);
  return response.data;
};

export const getDSAStats = async () => {
  const response = await api.get("/dsa/stats");
  return response.data;
};
