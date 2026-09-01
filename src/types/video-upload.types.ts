export type VideoUploadPhase =
  | "idle"
  | "validating"
  | "preparing"
  | "uploading"
  | "pausing"
  | "paused"
  | "offline"
  | "transfer-complete"
  | "processing"
  | "confirming"
  | "ready"
  | "error"
  | "aborted";
