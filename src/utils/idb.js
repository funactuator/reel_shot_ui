import { openDB } from "idb";

const DB_NAME = "video_frames_db";
const STORE_NAME = "frames";

const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });
};

export const saveFrame = async (frame) => {
  const db = await initDB();
  return db.add(STORE_NAME, frame);
};

export const getAllFrames = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

export const deleteFrame = async (id) => {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
};