import { DataSource, Repository } from 'typeorm';
import { Item } from './entities/Item';
import path from 'path';
import {app} from 'electron'

let dataSource: DataSource | null
let itemRepo: Repository<Item> | null

const initializeDatabase = async() => {
    console.log('INIT DB', path.join(app.getPath('userData'), 'myapp.sqlite'))
    dataSource = new DataSource({
        type: 'sqlite',
        database: '../../db/database.db',//path.join(app.getPath('userData'), 'myapp.sqlite'),
        entities: [Item],
        synchronize: true
    });

    await dataSource.initialize();
    console.log('DB LOG: Database connected successfully');

    itemRepo = dataSource.getRepository(Item)

    return dataSource;
}

const getItems = async(take: number = 10) => {
    const items = itemRepo?.find({
        take
    })

    console.log('DB LOG: ', items)

    return items
}

const saveItem = async (item: any) => {
    if (!itemRepo) return
   console.log('SAVE ITEM',await itemRepo.save(item))

}

export { initializeDatabase, getItems, saveItem}