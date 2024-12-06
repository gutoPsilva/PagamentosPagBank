import dotenv from 'dotenv';
import PagBankService from './services/pagbank.service.js';

dotenv.config();

const main = async () => {
  const pagBankService = new PagBankService();

  // await pagBankService.CriarPedidoPix();

  // await pagBankService.CriarPedidoDebito();

  // await pagBankService.ConsultarPedido("CHAR_BC9F17EE-DC0A-459D-8396-063D73C454D0");

  const chavePublica = await pagBankService.ConsultarChavePublica();

  console.log(chavePublica);

  if(!chavePublica) {
    await pagBankService.CriarChavePublica();
  }

}

main();