import type {Task} from "../domain/core/Task";

export const composeTask = (key: string, task: any): Task => {
    return {
        pk: key,
        id: {
            value: task.id.value,
            type: task.id.type,
            publicKey: task.id.publicKey
        },
        status: task.status,
        details: {
            value: task.details.value
        }
    }
}

