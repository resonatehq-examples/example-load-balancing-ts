import { Resonate } from "@resonatehq/sdk";
import type { Context } from "@resonatehq/sdk";

const resonate = Resonate.remote({
  group: "workers",
});

function computeSomething(context: Context, args: any): void {
  const id = args.id;
  const computeCost = args.computeCost;
  console.log(`${id} starting computation`);
  setTimeout(() => {
    console.log(`${id} computed something that cost ${computeCost} seconds`);
  }, computeCost * 1000); // Simulate computation time
  return;
}

resonate.register("computeSomething", computeSomething);

console.log("worker is running...");
