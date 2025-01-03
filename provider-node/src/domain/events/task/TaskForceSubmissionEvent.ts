import { TaskSubmissionEvent } from './TaskSubmissionEvent.js'

export interface TaskForceSubmissionEvent extends TaskSubmissionEvent {
    provider: string
}
