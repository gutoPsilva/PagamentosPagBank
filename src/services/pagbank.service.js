import AxiosService from './axios.service.js';
import { readFileSync } from 'fs';
import vm from 'vm';

export default class PagBankService {
  axios = null; 

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

  async EncriptarCartao() {
    const sdkScript = readFileSync('./libs/sdk.min.js', 'utf-8');

    const context = {
      navigator: {
        userAgent: 'node.js'
      },
      window: {}
    };

    vm.createContext(context);
    const script = new vm.Script(sdkScript);
    script.runInContext(context);

    const pagSeguro = context.PagSeguro;

    const card = pagSeguro.encryptCard({
      publicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr+ZqgD892U9/HXsa7XqBZUayPquAfh9xx4iwUbTSUAvTlmiXFQNTp0Bvt/5vK2FhMj39qSv1zi2OuBjvW38q1E374nzx6NNBL5JosV0+SDINTlCG0cmigHuBOyWzYmjgca+mtQu4WczCaApNaSuVqgb8u7Bd9GCOL4YJotvV5+81frlSwQXralhwRzGhj/A57CGPgGKiuPT+AOGmykIGEZsSD9RKkyoKIoc0OS8CPIzdBOtTQCIwrLn2FxI83Clcg55W8gkFSOS6rWNbG5qFZWMll6yl02HtunalHmUlRUL66YeGXdMDC2PuRcmZbGO5a/2tbVppW6mfSWG3NPRpgwIDAQAB",
      holder: "Gustavo Pereira da Silva",
      number: "4539620659922097",
      expMonth: "12",
      expYear: "2030",
      securityCode: "123"
    });

    if(card.errors) {
      console.log(card.errors);
      // throw new Error(card.errors[0]);
    }

    return card.encryptedCard;
  }

  async CriarPedidoDebito() {
    const encryptedCard = await this.EncriptarCartao();

    console.log('CARD ENCRIPTADO: ' + encryptedCard);

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
                encrypted: encryptedCard,
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

      return data.id;
    } catch(err) {
      console.error(err);
    }
  }

  async ConsultarPedido(id) {
    try {
      const { data } = await this.axios.get(`orders/${id}`);

      console.log("PEDIDO: \n")

      console.log(JSON.stringify(data));
    } catch(err) {
      console.error(err);
    }
  }

  async ConsultarPagamento(id) {
    try {
      const { data } = await this.axios.get(`charges/${id}`);

      console.log("PAGAMENTO: \n")

      console.log(JSON.stringify(data));
    } catch(err) {
      console.error(err);
    }
  }

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
        charges: {
          payment_method: {
            type: "PIX",
            pix: {
              holder: {
                name: "Nome do pagador",
                tax_id: "***534218**"
              }
            }
          }
        }
      }

      // console.log(JSON.stringify(body));

      const { data } = await this.axios.post("orders", body);

      console.log(data);

      return data.id;
    } catch(err) {
      // console.error(err);
    }
  }
}
