import { ActorID, Client, TimeTicket } from 'yorkie-js-sdk';
import { ToolType } from 'features/boardSlices';
import { Point, Root, Shape } from 'features/docSlices';
import { Peer } from 'features/peerSlices';
import { LineOption } from '../line';

type Options = LineOption;

abstract class Worker {
  abstract type: ToolType;

  abstract update: Function;

  abstract emit: Function;

  abstract mousedown(point: Point, options: Options): void;

  abstract mousemove(point: Point): void;

  abstract mouseup(): void;

  abstract flushTask(): void;

  abstract destroy(): void;

  protected activePeerMap: Map<ActorID, Peer> = new Map();

  protected client!: Client;

  resetPeers(client: Client, activePeers: Array<Peer>) {
    this.client = client;
    this.updatePeers(activePeers);
  }

  updatePeers(activePeers: Array<Peer>) {
    this.activePeerMap.clear();
    for (const peer of activePeers) {
      this.activePeerMap.set(peer.id, peer);
    }
  }

  protected setIsEditShape(id: TimeTicket) {
    this.update((root: Root) => {
      const shape = root.shapes.getElementByID(id);
      shape.isEditing = true;
      shape.editorID = this.client.getID()!;
    });
  }

  protected unsetIsEditShape(id: TimeTicket) {
    this.update((root: Root) => {
      const shape = root.shapes.getElementByID(id);
      shape.isEditing = false;
    });
  }

  private isEditingShape(shape: Shape) {
    return shape.isEditing && this.activePeerMap.has(shape.editorID);
  }

  protected deleteShapeByID(id: TimeTicket) {
    this.update((root: Root) => {
      const shape = root.shapes.getElementByID(id);

      if (this.isEditingShape(shape)) {
        return;
      }

      root.shapes.deleteByID(id);
    });
  }

  protected drawAll() {
    this.update((root: Root) => {
      this.emit('renderAll', root.shapes);
    });
  }
}

export default Worker;
