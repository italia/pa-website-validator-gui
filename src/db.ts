import { DataSource, FindOptionsOrderValue, Repository } from "typeorm";
import { Item } from "./entities/Item.js";
import path from "path";
import { app } from "electron";
import { Status } from "./types/types.js";
import { accessSync, mkdirSync } from "fs";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

const __dirname = import.meta.dirname;
const saveDirname = app.getPath("userData");

let dataSource: DataSource | null;
let itemRepo: Repository<Item> | null;

const dbFolder = path.join(saveDirname, "db");

async function createFullTextIndex(dataSource: DataSource): Promise<void> {
  await dataSource.query(`
    CREATE VIRTUAL TABLE IF NOT EXISTS item_fts USING fts5(
      url
    );
  `);

  // Create trigger to update FTS index when the main table is modified
  await dataSource.query(`
    CREATE TRIGGER IF NOT EXISTS item_fts_update
    AFTER INSERT ON item
    BEGIN
      INSERT INTO item_fts(url) VALUES(new.url);
    END;
  `);
}

const initializeDatabase = async () => {
  console.log("INIT DB", path.join(app.getPath("userData"), "myapp.sqlite"));
  dataSource = new DataSource({
    type: "sqlite",
    database: path.join(dbFolder, "database.db"),
    entities: [Item],
    synchronize: true,
  });

  await dataSource.initialize();
  console.log("DB LOG: Database connected successfully");

  itemRepo = dataSource.getRepository(Item);

  await createFullTextIndex(dataSource);
  return dataSource;
};

const getItems = async (
  page = 1,
  pageSize = 10,
): Promise<{
  items: Item[];
  pagination: { total: number; currentPage: number; numberOfPages: number };
}> => {
  const returnValues = {
    items: [] as Item[],
    pagination: {
      total: 0,
      numberOfPages: 0,
      currentPage: 1,
    },
  };

  if (!itemRepo) return returnValues;

  let queryArgs;

  if (pageSize != -1) {
    queryArgs = {
      take: pageSize,
      skip: (page - 1) * pageSize,
      order: {
        date: "DESC" as FindOptionsOrderValue,
      },
    };
  } else {
    queryArgs = {
      order: {
        date: "DESC" as FindOptionsOrderValue,
      },
    };
  }

  const [items, total] = await Promise.all([
    itemRepo.find(queryArgs),
    itemRepo.count(),
  ]);

  returnValues.items = items;
  returnValues.pagination.total = total;
  returnValues.pagination.numberOfPages = Math.ceil(total / pageSize);
  returnValues.pagination.currentPage = page;

  return returnValues;
};

const getItemById = async (id: string): Promise<Item | null> => {
  if (!itemRepo) return null;

  return await itemRepo.findOne({
    where: {
      id: id,
    },
  });
};

const insertItem = async (url: string, args?: Record<string, unknown>) => {
  if (!itemRepo) return;

  try {
    const newItem = new Item();
    newItem.url = url;
    newItem.type = args?.type as string;

    // Set optional fields

    if (args?.audits !== undefined)
      newItem.auditsExecuted = args.audits as string[];
    if (args !== undefined) newItem.args = args;

    // Insert the item and get the newly created entity
    const insertedItem = await itemRepo.insert(
      newItem as QueryDeepPartialEntity<Item>,
    );

    const identifiers = insertedItem.identifiers;
    const generatedId = identifiers[0].id;

    console.log("INSERTED ITEM ID", generatedId);

    const reportFolder = createFolderWithId(generatedId);

    return {
      id: generatedId,
      reportFolder,
    };
  } catch (error) {
    console.error("Error inserting item:", error);
    throw error;
  }
};

const updateItem = async (
  id: string,
  type: string,
  executionTime: number,
  score: number,
  failedAudits: string[],
  successCount: number,
  failedCount: number,
  errorCount: number,
  accuracy: string,
  timeout: number,
  concurrentPages: number,
  scope: string,
) => {
  if (!itemRepo) return;

  try {
    const insertedItem: Item | null = await itemRepo.findOne({
      where: {
        id: id,
      },
    });

    if (!insertedItem) {
      throw new Error(`Item with id=${id} not found`);
    }

    await itemRepo.update(id, {
      executionTime: executionTime,
      type: type,
      status:
        score === 1
          ? Status.PASSED
          : score === -1
            ? Status.ERRORED
            : Status.FAILED,
      failedAudits: failedAudits,
      successCount: successCount,
      errorCount: errorCount,
      failedCount: failedCount,
      accuracy: accuracy,
      timeout: timeout,
      concurrentPages: concurrentPages,
      scope: scope,
    });

    console.log("UPDATED ITEM ID", id);

    return;
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
};

const deleteItem = async (id: string) => {
  if (!itemRepo) return;

  try {
    await itemRepo.delete(id);

    console.log("DELETED ITEM ID", id);

    return;
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
};

const searchURL = async (searchText: string, page = 1, pageSize = 10) => {
  if (!itemRepo) return;

  const result = await itemRepo
    .createQueryBuilder("item")
    .select("item")
    .leftJoinAndSelect("item_fts", "ui", "ui.url = item.url")
    .where(`ui.url LIKE :searchText`, { searchText: `%${searchText}%` })
    .skip((page - 1) * pageSize)
    .take(pageSize)
    .getMany();

  return result;
};

const createFolderWithId = (id: string): string | null => {
  // Create the full path for the new folder
  const folderPath = path.join(dbFolder, "reports", id);

  console.log("DIRNAME", __dirname);

  const absoluteFolderPath = path.resolve(folderPath);

  console.log("CREATE INTO", absoluteFolderPath);

  // Check if the folder already exists
  //await accessSync(folderPath)

  // Create the folder if it doesn't exist
  mkdirSync(absoluteFolderPath, { recursive: true });

  try {
    accessSync(absoluteFolderPath);
    return absoluteFolderPath;
  } catch {
    console.log("error creating folder");
    throw new Error("error creating folder");
  }
};

const getFolderWithId = (id: string): string | null => {
  const folderPath = path.join(dbFolder, "reports", id);

  console.log("DIRNAME", __dirname);

  const absoluteFolderPath = path.resolve(folderPath);

  console.log("CREATE INTO", absoluteFolderPath);

  try {
    accessSync(absoluteFolderPath);
    return absoluteFolderPath;
  } catch {
    console.log("error return folder");
    throw new Error("error return folder");
  }
};

export {
  initializeDatabase,
  getItems,
  insertItem,
  searchURL,
  updateItem,
  getItemById,
  getFolderWithId,
  deleteItem,
};
