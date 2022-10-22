import service from "../services/TaskService.js";

async function execTask(){
    try {
        await service.applyPenalty();
        await service.sendEmail();

        console.log("Task concluída!");
    } catch (error) {
        console.log(error.message);
    }
    return
}

// execTask()
export default execTask;