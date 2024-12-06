import AxiosService from './axios.service.js';

export default class PagBankService {
  axios; 

  constructor() {
    const axiosService = new AxiosService();

    this.axios = axiosService.Criar();
  }

  async CriarChavePublica() {
    try {
      const body = {
        type: "card"
      }

      const { data } = await this.axios.post("public-keys", body);

      console.log(data);

      return data.public_key;
    } catch(err) {
      console.error(err);
    }
  }

  async ConsultarChavePublica() {
    try {
      const { data } = await this.axios.get("public-keys/card");

      console.log(data);

      return data.public_key;
    } catch(err) {
      console.error(err);
    }
  }

  async CriarPedidoDebito() {
    try {
      const body = {
        reference_id: "pedido1", // IDENTIFICAÇÃO DO PEDIDO
        customer: { // OBRIGATÓRIO
          name: "Erick Rodolfo Monteiro",
          email: "erick_rodolfo10@gmail.com",
          tax_id: "08651611196", // OBRIGATÓRIO --> CPF OU CNPJ (SEM PONTUAÇÃO),
          phones: [
            {
              country: "55", // DDI, obrigatório
              area: "11", // DDD, obrigatório
              number: "989109727", // NÚMERO, obrigatório
              type: "MOBILE",
            }
          ]
        },
        items: [
          {
            name: "Nome do produto",
            quantity: 5,
            unit_amount: 10,
          }
        ],
        notification_urls: [
          "https://meu-site.com.br/notificacao"
        ],
        charges: [ // apenas para cartão ou Boleto
          {
            reference_id: "cobranca1cartao", // IDENTIFICAÇÃO DA COBRANÇA
            description: "Descrição da cobrança",
            amount: {
              value: 10, //R$ 1.500,99 = 150099
              currency: "BRL", // apenas BRL
            },
            payment_method: {
              type: "DEBIT_CARD", // CREDIT_CARD, DEBIT_CARD, BOLETO
              // installments: 1, // parcelas APENAS PARA O CREDITO
              card: {
                encrypted: "CtlUuHwONtXvZnbg659aY5ooVzf/0YXD5QoG25GVYJvPi5pQhIpaE2AMN+HrmCrFib8Loc6Y5GFJ5F0XGBonFm1+GWy4efyyj3m3ERij4g3QIEppsEBVSvsNAumN5C6xAl1N4M/tui6R1ADccktCeEvQTh4KEA8FNhciriTzcKxHwbYQ+ZbZADS50I208b5CsnInqled2G9bXW2poDYBHB644GzvYV0KHNV0G0bcNziGRggAVj57LYXEejXNcM9lY6Rm1q1HyuGCJ/dmgrGF9Fs5tWbp0OPC0qgPBX/LbuqiB2JRZU1FEg2P6zl4QOegg4mdoRX9+9IRG1kD2oI7nA==",
                holder: {
                  name: "Gustavo Pereira da Silva",
                  tax_id: "24309587836"
                }
              },
              authentication_method: {
                type: "THREEDS",
                version: "2.0.1",
                eci: "01",
                cavv: "BwABBylVaQAAAAFwllVpAAAAAAA=",
              }
            }
          }
        ]
      }

      const response = await this.axios.post("orders", body);

      console.log(response.data);

    } catch(err) {
      console.error(err);
    }
  }

  async ConsultarPedido(id) {
    try {
      const response = await this.axios.get(`orders/${id}`);

      console.log(response.data);
    } catch(err) {
      console.error(err);
    }
  }

  // async PagarPedido(id) {
  //   try {
  //     const response = 
  //   } catch(err) {

  //   }
  // }

  async CriarPedidoPix() {
    try {
      const body = {
        reference_id: "pedido1", // IDENTIFICAÇÃO DO PEDIDO
        customer: { // OBRIGATÓRIO
          name: "Erick Rodolfo Monteiro",
          email: "erick_rodolfo10@gmail.com",
          tax_id: "08651611196", // OBRIGATÓRIO --> CPF OU CNPJ (SEM PONTUAÇÃO),
          phones: [
            {
              country: "55", // DDI, obrigatório
              area: "11", // DDD, obrigatório
              number: "989109727", // NÚMERO, obrigatório
              type: "MOBILE",
            }
          ]
        },
        items: [
          {
            name: "Nome do produto",
            quantity: 1,
            unit_amount: 10,
          }
        ],
        shipping: {
          address: {
            street: "Avenida Vida Nova",
            number: 142,
            complement: "Complemento", // NÃO DEVE SER ENVIADO VAZIO, apesar de opcional
            locality: "Jardim Maria Rosa", // Bairro
            city: "Taboão da Serra",
            region_code: "SP", // Estado (UF)
            country: "BRA", // Código do País (Padrão ISO 3166-1 alpha-3)
            postal_code: "06764045" // Sem acentuação
          }
        },
        qr_codes: [
          {
            amount: {
              value: 10,
            },
            // expiration_date: "2024-12-31T23:59:59Z", // PADRÃO 24HRS
          }
        ],
        notification_urls: [
          "https://meu-site.com.br/notificacao"
        ],
      }

      // console.log(JSON.stringify(body));

      const response = await this.axios.post("orders", body);

      console.log(response.data);

      // console.log(response.data);

    } catch(err) {
      // console.error(err);
    }
  }
}
