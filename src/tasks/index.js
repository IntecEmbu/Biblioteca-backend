import service from "../services/TaskService.js";

async function execTask(){
    try {
        await service.applyPenalty();
        console.log("Task concluída!");
    } catch (error) {
        console.log(error.message);
    }
}

execTask()
// export default execTask