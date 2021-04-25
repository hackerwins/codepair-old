---
title: drawing-canvas
---

# Drawing canvas

## Summary

We help users to express their thoughts in `CodePair` using tools.

### Goals

Implement so that several shapes can be drawn on the canvas by receiving events from the browser.

### Non-Goals

## Proposal Details

![draw-structure](https://user-images.githubusercontent.com/10924072/115980398-64042400-a5c7-11eb-8676-90a334d380c0.png)

Each role is as follows

- Container

  - `Container` receives the user's event and passes it to `Worker`, and receives the shape to be drawn on the canvas from `worker` and draws it on the canvas.
    - lower canvas
      - `lower canvas` draws shapes that exist in the `yorkie document`.
    - upper canvas
      - `upper canvas` draws shapes that will be changed by user events.

- Worker

  - `Worker` executes tasks in `yorkie document` considering the currently applied tools and environment.

- Scheduler
  - `Scheduler` receives tasks from workers, stores them, and executes them at specific cycles.
    The reason for doing this is that there are a lot of data accumulated in the document when all the operations requested by the user are executed.

![image](https://user-images.githubusercontent.com/10924072/115982022-eba36000-a5d2-11eb-9fdf-c476ded2bd23.png)

1. The user requests an event.
2. `Container` delivers the event to `Worker`.
3. `Worker` can schedule work to `Scheduler` according to the situation.
4. When there is a scheduled task, `Scheduler` executes the registered task according to a specific cycle.
5. After working on the document, `Worker` delivers the part to be rendered on the canvas to `Container`.
   (Choose whether to use Upper Canvas or Lower Canvas)
   `Container` draws shapes on the canvas.

### Risks and Mitigation

Not all events are applied to the document, so there is some delay when applied to other users.
