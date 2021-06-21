---
title: drawing-canvas
---

# Drawing canvas

## Summary

We provide drawing tools to make it easier for users to express their thoughts.

### Goals

Implement drawing tools that can express various shapes such as lines and rectangles and so on using HTML Canvas.

## Proposal Details

![image](https://user-images.githubusercontent.com/10924072/119370901-cf3d3500-bcf0-11eb-84f6-a67cbb8bbea6.png)

Each role is as follows

- Board
  - `Board` receives the user's event and passes it to `Worker`, and receives the shape to be drawn on the canvas from `worker` and draws it on the canvas.
  - lower canvas: `lower canvas` draws shapes that exist in the `yorkie document`.
  - upper canvas: `upper canvas` draws shapes that will be changed by user events.
- Worker
  - `Worker` executes tasks in `yorkie document` considering the currently applied tools and environment.
- Scheduler
  - `Scheduler` receives tasks from workers, stores them, and executes them at specific cycles.
    The reason for doing this is that there are a lot of data accumulated in the document when all the operations requested by the user are executed.

### Risks and Mitigation

Not all events are applied to the document, so there is some delay when applied to other users.
