import { Resonate } from "@resonatehq/sdk";
import { v4 as uuid } from "uuid";

const resonate = Resonate.remote({
  group: "client",
});

async function main() {
  try {
    const id = uuid();
    const computeCost = randint(1, 10);
    await resonate.beginRpc(
      id,
      "computeSomething",
      { id: id, computeCost: computeCost },
      resonate.options({
        target: "poll://any@workers",
      })
    );
    resonate.stop();
  } catch (e) {
    console.log(e);
  }
}

function randint(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

main();
