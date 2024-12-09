import dotenv from 'dotenv';
import PagBankService from './services/pagbank.service.js';


dotenv.config();

const main = async () => {
  const pagBankService = new PagBankService();

  const retorno = await pagBankService.CriarPedidoPix();
  // const retorno = await pagBankService.CriarPedidoDebito();

  console.log(retorno.id);

  let seg = 0;

  if(retorno.charges) {
    const pay = retorno.charges[0].payment_response;
    console.log(`${pay.message}`);
  } else {
    const intervalId = setInterval(async () => {
      var ret = await pagBankService.ConsultarPagamentoPedido(''+retorno.id);
  
      console.log(`Consulta em ${seg}s`);
  
      seg += 3;
  
      if(ret && ret[0]) {
        clearInterval(intervalId);
        console.log("INFORMAÇÕES PAGAMENTO: ");
        const pay = ret[0].payment_response;
        console.log(`${pay.message}`);
      }
    }, 5000);
  }

  // await pagBankService.ConsultarPedido("ORDE_CA53E9D5-F09E-4B11-896E-7D0353EE4696");

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