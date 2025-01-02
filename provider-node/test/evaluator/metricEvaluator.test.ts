import { describe, expect, it } from "vitest";
import { Task } from "../../src/domain/core/task/Task.js";
import { MetricBasedTaskEvaluator } from "../../src/application/evaluator/impl/MetricBasedTaskEvaluator.js";
import { Metric } from "../../src/domain/core/metric/Metric.js";

describe("Metric task evaluator", (): void => {
    const myMetric: () => Promise<Metric> = async (): Promise<Metric> => ({
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
    });

    const otherMetrics: () => Map<string, Metric> = (): Map<string, Metric> =>
        new Map([
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
        ]);

    const taskEvaluator: MetricBasedTaskEvaluator = new MetricBasedTaskEvaluator(myMetric, otherMetrics);

    describe("When I have more free resources than anyone else", (): void => {
        it("returns true indicating that I should execute the task", async (): Promise<void> => {
            const result = await taskEvaluator.evaluate(undefined as unknown as Task);
            expect(result).toBe(true);
        });

        it("returns a list of other possible candidates", async (): Promise<void> => {
            const candidates = await taskEvaluator.getCandidates(undefined as unknown as Task, 2);
            expect(candidates).toEqual(["node3", "node1"]);
        });
    });

    describe("When other nodes have better resources", (): void => {
        it("returns false indicating that I should not execute the task", async (): Promise<void> => {
            const myMetricUpdated = async (): Promise<Metric> => ({
                memory: {
                    total: 500,
                    free: 200,
                    used: 300,
                },
                cpu: {
                    model: "Intel i7",
                    load: 90,
                    cores: 8,
                    threads: 20,
                    speed: 3.0,
                },
                gpu: [],
            });

            const taskEvaluatorUpdated = new MetricBasedTaskEvaluator(myMetricUpdated, otherMetrics);
            const result = await taskEvaluatorUpdated.evaluate(undefined as unknown as Task);
            expect(result).toBe(false);
        });

        it("returns the best candidates from other nodes", async (): Promise<void> => {
            const myMetricUpdated = async (): Promise<Metric> => ({
                memory: {
                    total: 500,
                    free: 200,
                    used: 300,
                },
                cpu: {
                    model: "Intel i7",
                    load: 90,
                    cores: 8,
                    threads: 20,
                    speed: 3.0,
                },
                gpu: [],
            });

            const taskEvaluatorUpdated = new MetricBasedTaskEvaluator(myMetricUpdated, otherMetrics);
            const candidates = await taskEvaluatorUpdated.getCandidates(undefined as unknown as Task, 2);
            expect(candidates).toEqual(["node3", "node1"]);
        });
    });
});
