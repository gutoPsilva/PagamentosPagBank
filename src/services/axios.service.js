import axios from "axios";

export default class AxiosService {
  constructor() {}

  Criar() {
    const instance = axios.create({
      headers: {
        Authorization: "Bearer " + process.env.TOKEN_PAG_BANK,
      },
      baseURL: "https://sandbox.api.pagseguro.com/",
    });

    return instance;
  }
}
