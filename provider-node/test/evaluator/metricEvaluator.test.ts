import {describe, expect, it} from 'vitest'
import {Task} from "../../src/domain/core/task/Task.js";
import {MetricBasedTaskEvaluator} from "../../src/application/evaluator/impl/MetricBasedTaskEvaluator.js";
import {Metric} from "../../src/domain/core/metric/Metric.js";

describe("Metric task evaluator", (): void => {
    const myMetric: () => Promise<Metric> = async (): Promise<Metric> => {
        return {
            memory: {
                total: 1000,
                free: 500,
                used: 500,
            },
            cpu: {
                model: "Intel i7",
                load: 50,
                cores: 8,
                threads: 20,
                speed: 3.5,
            },
            gpu: [],
        }
    }

    const otherMetrics: () => Map<string, Metric> = (): Map<string, Metric> => {
        return new Map([
            ["node1", {
                memory: {
                    total: 900,
                    free: 400,
                    used: 500,
                },
                cpu: {
                    model: "Intel i7",
                    load: 80,
                    cores: 8,
                    threads: 20,
                    speed: 3.5,
                },
                gpu: [],
            }],
            ["node2", {
                memory: {
                    total: 800,
                    free: 300,
                    used: 500,
                },
                cpu: {
                    model: "Intel i7",
                    load: 80,
                    cores: 8,
                    threads: 20,
                    speed: 3.5,
                },
                gpu: [],
            }],
            ["node3", {
                memory: {
                    total: 2000,
                    free: 400,
                    used: 1600,
                },
                cpu: {
                    model: "Intel i7",
                    load: 50,
                    cores: 8,
                    threads: 20,
                    speed: 3.5,
                },
                gpu: [],
            }],
        ])
    }

    const taskEvaluator: MetricBasedTaskEvaluator = new MetricBasedTaskEvaluator(myMetric, otherMetrics)
    describe('When I have more free resources than anyone else', (): void => {
        it('returns a true value indicating that I should execute the task', async (): Promise<void> => {
            //const task: SumTask = SumTaskFactory.taskFrom({}, 1, 2)
            expect(await taskEvaluator.evaluate(undefined as unknown as Task)).toBe(true)
        })

    /*    it('responds with the exceeding security rules otherwise', async (): Promise<void> => {

            expect(securityRules.status).toBe(HttpStatusCode.OK)
            expect(securityRules.type).toBe('application/json')
        })*/
    })

/*    describe('GET /rules/intrusions', (): void => {
        it('responds with a forbidden status if no auth token is provided', async (): Promise<void> => {

            expect(securityRules.status).toBe(HttpStatusCode.FORBIDDEN)
        })

        it('responds with the intrusion security rules otherwise', async (): Promise<void> => {

            expect(securityRules.status).toBe(HttpStatusCode.OK)
            expect(securityRules.type).toBe('application/json')
        })
    })*/
})