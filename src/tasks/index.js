import applyPenalty from "./applyPenalty.js";
import warningLending from "./warningLending.js";
import checkRecoveryToken from "./checkRecoveryToken.js";

async function execTask(){
  // Inicia contador para contabilizar o tempo de execução da tarefa
  const start = new Date();
  console.log("Iniciando tarefa...");

  try {
    await applyPenalty();
    await warningLending();
    await checkRecoveryToken();

    console.log("Tempo de execução: ", new Date() - start);
  }catch (error) {
    console.log(error.message);
  } 
}

// execTask()
export default execTask;