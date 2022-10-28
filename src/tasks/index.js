import service from "./service.js";

async function execTask(){
    try {
        await service.applyPenalty();
        await service.sendEmail();
        await service.checkRecoveryToken();

        console.log("Task concluída!");
    } catch (error) {
        console.log(error.message);
    }
    return
}

// execTask()
export default execTask;