import {DataSource, Repository} from 'typeorm';
import {Item} from './entities/Item.js';
import path from 'path';
import {app} from 'electron'
import {Status} from './types/types.js';
import {accessSync, mkdirSync} from 'fs';

const __dirname = import.meta.dirname;

let dataSource: DataSource | null
let itemRepo: Repository<Item> | null
let dbFolder = path.join(__dirname,'..', 'db')

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
    console.log('INIT DB', path.join(app.getPath('userData'), 'myapp.sqlite'))
    dataSource = new DataSource({
        type: 'sqlite',
        database: path.join(dbFolder,'database.db'),//path.join(app.getPath('userData'), 'myapp.sqlite'),
        entities: [Item],
        synchronize: true
    });

    await dataSource.initialize();
    console.log('DB LOG: Database connected successfully');

    itemRepo = dataSource.getRepository(Item)

    await createFullTextIndex(dataSource);
    return dataSource;
}

const getItems = async (page = 1, pageSize = 10): Promise<{ items: any[], total: number }> => {
    let returnValues = {
        total: 0,
        items: [] as Item[]
    }

    if (!itemRepo) return returnValues;

    let queryArgs

    if (pageSize != -1) {
        queryArgs = {
            take: pageSize,
            skip: page - 1,
        }
    } else {
        queryArgs = {}
    }

    const [items, total] = await Promise.all([
        itemRepo.find(queryArgs),
        itemRepo.count()
    ]);

    returnValues = { items, total }

    return { items, total };
};

const insertItem = async (url: string, args?: Record<string, unknown>) => {
    if (!itemRepo) return;

    try {
        const newItem = new Item();
        newItem.url = url;

        // Set optional fields
         if (args?.audits !== undefined) newItem.auditsExecuted = args.audits as any;
         if (args !== undefined) newItem.args = args;

        // Insert the item and get the newly created entity
        const insertedItem = await itemRepo.insert(newItem as any)

        const identifiers = insertedItem.identifiers
        const generatedId = identifiers[0].id

        console.log('INSERTED ITEM ID', generatedId)


        const reportFolder = createFolderWithId(generatedId)

        return {
            id: generatedId,
            reportFolder
        }

    } catch (error) {
        console.error('Error inserting item:', error);
        throw error; 
    }
};

const updateItem = async (id:string, executionTime: number, score: number, failedAudits: string[]) => {
    if (!itemRepo) return;

    try {

        const insertedItem : Item | null = await itemRepo.findOne({
            where: {
                id: id
            }
        })

        if(!insertedItem){
            throw new Error(`Item with id=${id} not found`)
        }

        await itemRepo.update(id, {executionTime : executionTime, status: score === 1 ? Status.PASSED : score === -1 ? Status.ERRORED : Status.FAILED, failedAudits: failedAudits});

        console.log('UPDATED ITEM ID', id)

        return

    } catch (error) {
        console.error('Error updating item:', error);
        throw error;
    }
}

const searchURL = async (searchText: string, page = 1, pageSize = 10) => {
    if (!itemRepo) return

    const result = await itemRepo.createQueryBuilder('item')
        .select('item')
        .leftJoinAndSelect('item_fts', 'ui', 'ui.url = item.url')
        .where(`ui.url LIKE :searchText`, { searchText: `%${searchText}%` })
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .getMany();

    return result;
}

const createFolderWithId = (id: string): string | null => {
    // Create the full path for the new folder
    const folderPath = path.join(dbFolder, 'reports', id);

    console.log('DIRNAME',__dirname)
 
    const absoluteFolderPath = path.resolve(folderPath);


    console.log('CREATE INTO',absoluteFolderPath)

    // Check if the folder already exists
    //await accessSync(folderPath)

    // Create the folder if it doesn't exist
    mkdirSync(absoluteFolderPath, { recursive: true });

    try {
        accessSync(absoluteFolderPath)
        return absoluteFolderPath
    } catch (err) {
        console.log('error creating folder')
        throw new Error('error creating folder')
    }

}


export { initializeDatabase, getItems, insertItem, searchURL, updateItem }