import axios from "axios";

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: "http://localhost:5000/api/v1/",
      timeout: 300000,
    });
  }

  get(path) {
    return this.client.get(path);
  }

  post(path, data) {
    return this.client.post(path, data);
  }

  put(path, data) {
    return this.client.put(path, data);
  }

  delete(path) {
    return this.client.delete(path);
  }

  async sendMessage(messages) {
    return new Promise((resolve, reject) => {
      this.client
        .post("chat", {
          messages: messages,
        })
        .then((res) => {
          const data = res.data;
          resolve(data.message);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async summarize(message) {
    return new Promise((resolve, reject) => {
      this.client
        .post("summarize", {
          message: {
            content: message,
            role: "user",
          }
        })
        .then((res) => {
          const data = res.data;
          resolve(data.message);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async transcribeVideo(video) {
    return new Promise((resolve, reject) => {
      this.client
        .post("transcribe", video)
        .then((res) => {
          const data = res.data;
          resolve(data.message);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async getCursos() {
    return new Promise((resolve, reject) => {
      this.client
        .get("cursos")
        .then((res) => {
          const data = res.data;
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async newCurso(curso) {
    return new Promise((resolve, reject) => {
      this.client
        .post("cursos/add", curso)
        .then((res) => {
          const data = res.data;
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  
}

const Api = new ApiClient();

export default Api;
