export class RoomCleanupEvent {
  static readonly event = "room.cleanup";

  constructor(public readonly roomId: string) {}
}
