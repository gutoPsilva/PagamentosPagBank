import dotenv from 'dotenv';
import PagBankService from './services/pagbank.service.js';


dotenv.config();

const main = async () => {
  const pagBankService = new PagBankService();

  // const id = await pagBankService.CriarPedidoPix();

  await pagBankService.ConsultarPagamento("CHAR_13CEF69E-ED53-4E0E-80FB-715CAAA77C90");

  // const id = await pagBankService.CriarPedidoDebito();

  // console.log("\n\n ID DO PEDIDO: ", id);

  // if(id) {
  //   await pagBankService.ConsultarPedido(id);
  // }

  // const chavePublica = await pagBankService.ConsultarChavePublica();

  // console.log(chavePublica);

  // if(!chavePublica) {
  //   await pagBankService.CriarChavePublica();
  // }

  
}

main();