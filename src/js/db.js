import Dexie from "dexie";

export const db = new Dexie("test1");

db.version(1).stores({
  items: "date, dataList"
});
