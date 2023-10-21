const api =  {
    urlApi: "/api/v1/",
    authorization: "Bearer "+localStorage.getItem("token"),
  
    async get(url, data) {
      const response = await fetch(this.urlApi + url, {
        headers: {
          token: "Bearer "+localStorage.getItem("token")
        },
        method: "GET",
        params: data
      });
      const result = await response.json();
      return result;
    },
    async getUrl(url, data) {
      const response = await fetch(url, {
        headers: {
          token: "Bearer "+ localStorage.getItem("token"),
          "Content-Type": "application/json"
        },
        method: "GET",
        params: data
      });
      const result = await response.json();
      return result;
    },
    async post(url, data) {
      const response = await fetch(this.urlApi + url, {
        headers: {
          token: "Bearer "+localStorage.getItem("token"),
          "Content-Type": "application/json"
        },
        method: "POST",
        body: data
      });
      const result = await response.json();
      return result;
    },
    async postUrl(url, data) {
      const response = await fetch(url, {
        headers: {
          token: "Bearer "+localStorage.getItem("token"),
          "Content-Type": "application/json"
        },
        method: "POST",
        body: data
      });
      const result = await response.json();
      return result;
    },
    async put(url, data) {
      const response = await fetch(this.urlApi + url, {
        headers: {
          token: "Bearer "+localStorage.getItem("token"),
          "Content-Type": "application/json"
        },
        method: "PUT",
        body: data
      });
      const result = await response.json();
      return result;
    },
    async delete(url, data) {
      const response = await fetch(this.urlApi + url, {
        headers: {
          token: "Bearer "+localStorage.getItem("token"),
          "Content-Type": "application/json"
        },
        method: "DELETE",
        body: data
      });
      const result = await response.json();
      return result;
    },
  
  };