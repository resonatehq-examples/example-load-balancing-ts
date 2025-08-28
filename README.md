![Resonate example app readme banner](/assets/resonate-example-app-readme-banner.png)

# Worker load balancing

**Resonate TypeScript SDK**

This example showcases Resonate's automatic service discovery and load balancing capabilities.

![load balancing terminal visualization gif](/assets/load-balancing-ts.gif)

## The problem

A single worker or microservice instance will eventually become overwhelmed if there is too much work sent its way in a short amount of time.

There are generally two ways to solve for this:

1. Increase the compute capability for the single worker / microservice.
2. Increase the number of worker / microservice instances.

There is an upper limit to the first option, and it is a single point of failure if there is only ever one instance running.

Therefore, the second option tends to be the desired approach, because in theory you can scale the number of instances indefinitely. However, this introduces another problem: service discovery and load balancing — that is, knowing which worker / application node has the capacity to take more work.

But not just that, what happens if a worker / microservice instance crashes after starting claiming work and starting to make progress it.

How does the system know it needs to recover that work somewhere else, and where to recover it?

These are distributed system engineering issues that developers are commonly forced to solve again and again.
And often they are forced to mix messy service discovery, load balancing, and recovery logic in with their application/business level logic, which makes for a very poor developer experience.

## The solution

Resonate has built-in service discovery, load balancing, and recovery. And it provides the developer with a simple RPC API and target schema to make use of these features.

In your worker / microservice you can just specify the group that it belongs to:

```typescript
const resonate = Resonate.remote({
  group: "workers",
});
```

Run as many instances of that worker / microservice that you need.

Then, when you need to call a function on that worker / microservice you use Resonate's RPC API, targeting any worker in that group.

```typescript
resonate.rpc(
  id,
  "function_name",
  args,
  resonate.options({
    target: "poll://any@workers",
  })
);
```

Resonate handles the rest!

You get automatic service discovery, load balancing, and recovery for all the workers in that group.

## About this example

This example demonstrates Resonate's built-in load balancing and recovery capabilities.

As the operator, you will run multiple instances of a worker (`worker.ts`).
The worker contains a single function `computeSomething()`.

You will then use the invoke script (`client.ts`) to start many `computeSomthing()` executions.

As you invoke more and more executions, you will see them start to spread across the multiple worker instances.

If you kill one of the workers while it is in the middle of handling executions, you will see the executions recover on another worker.

If you look at the code on the worker, you will notice that it identifies itself as a member of the `workers` group.

And if you look at the code on the invoke script, you will notice that the invocation of `computeSomething()` targets any worker in the `workers` group.

This example is meant to show that with minimal developer and operator overhead, you get load balancing and recovery out-of-the-box with Resonate.

## How to run this example

This example requires that a Resonate Server is running.
The Resonate Server acts as a Durable Promise store and a message broker.

Run the Resonate Server:

```shell
# install the server if you haven't yet
brew install resonatehq/tap/resonate
# start the server
resonate serve
```

Run multiple worker instances.
We recommend running at least 3 instances to get the best demonstration.

```shell
bun run worker.ts
```

Run the client script.
The client script does not block on a result from `computeSomething()`, so you can run it back to back, as many times as needed.
We recommend running it at least a dozen times to get the best demonstration.

```shell
bun run client.ts
```
