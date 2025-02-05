import { InternalServerErrorException } from "@nestjs/common";
import { Knex } from "knex";
import { IPaginate } from "../dtos/dto.common";
import * as crypto from 'crypto';
import { DB_TABLES, SELECT_FIELDS } from "../enums/db.enum";
import { fi } from "@faker-js/faker/.";

export class MysqlService<TDoc> {
    private DEFAULT_LIMIT = 10;
    private DEFAULT_PAGE = 1;

    constructor(
        private readonly knexModel: Knex,
        private readonly tableName: string
    ) { }

    // create new
    protected async createOne(createDataDto: Partial<TDoc>) {
        const [insertedId] = await this.knexModel.table(this.tableName).insert(createDataDto);

        if (!insertedId) {
            throw new InternalServerErrorException('insert failed');
        }
        const [data] = <TDoc[]>await this.knexModel.table(this.tableName).where('id', insertedId);

        return data;
    }

    // create many
    async createMany(createDataDto: Partial<TDoc>[]) {
        const insertedIds = await this.knexModel.table(this.tableName).insert(createDataDto);
        if (!insertedIds.length) {
            throw new InternalServerErrorException('insert failed');
        }

        const data = <TDoc[]>await this.knexModel.table(this.tableName).whereIn('id', insertedIds);

        return data;
    }

    // find all documents by query
    public async findByQuery(query: Partial<TDoc>, select?: string[]) {
        const data: TDoc[] = <TDoc[]>await this.knexModel.table(this.tableName).where({ ...query, deletedAt: null })
            .select(select || SELECT_FIELDS[this.tableName] || '*')
        return data;
    }

    public async findInByIds(ids: number[], select?: string[]) {
        const data: TDoc[] = <TDoc[]>await this.knexModel.table(this.tableName).whereIn('id', ids).andWhere({ deletedAt: null })
            .select(select || SELECT_FIELDS[this.tableName] || '*')
        return data;
    }

    // find all by paginate
    public async findWithPaginate(paginate?: IPaginate, query: Partial<TDoc> = {}, select?: string[]) {
        const { skip, page, limit } = this.pagination(paginate);

        const totalPromise = this.knexModel.table(this.tableName).where({ ...query, deletedAt: null }).count("id as total").first();
        const dataPromise = this.knexModel.table(this.tableName)
            .where({ ...query, deletedAt: null })
            .select(select || SELECT_FIELDS[this.tableName] || '*')
            .offset(skip)
            .limit(limit)
            .orderBy("id", "desc");

        const [{ total }, data] = await Promise.all([totalPromise, dataPromise]);

        return this.paginateResponse<TDoc>({ page, limit, total, data });
    }

    // search by query
    public async search(search: string, fields: string[], query: object = {}, select?: string[]) {
        const { skip, page, limit } = this.pagination({});
        const fieldStr = fields.join(',');


        // const [{ total }] = await this.knexModel.table(this.tableName).where({ ...query, deletedAt: null }).count("id as total");

        const data = <TDoc[]>await this.knexModel.table(this.tableName).whereRaw(`MATCH(${fieldStr}) AGAINST (? IN BOOLEAN MODE)`, [`+${search}*`])
            .where({ ...query, deletedAt: null })
            .select(select || SELECT_FIELDS[this.tableName] || '*')
            .offset(skip)
            .limit(limit)
        // .orderBy("id", "desc");


        return this.paginateResponse<TDoc>({ page, limit, total: limit, data });
    }

    // search by query
    public async searchLike(search: string, fields: string[], query: object = {}, select?: string[]) {
        const { skip, page, limit } = this.pagination({});
        const session = this.knexModel.table(this.tableName);
        fields.forEach((field, index) => {
            if (index === 0) {
                session.where(field, 'like', `%${search}%`);
            } else {
                session.orWhere(field, 'like', `%${search}%`);
            }
        });

        const data = <TDoc[]>await session.where({ ...query, deletedAt: null }) 
            .select(select || SELECT_FIELDS[this.tableName] || '*')
            .offset(skip)
            .limit(limit)
        // .orderBy("id", "desc");


        return this.paginateResponse<TDoc>({ page, limit, total: limit, data });
    }

    // find one document
    public async findOneById(id: number, select?: string[]) {
        const [data] = <TDoc[]>await this.knexModel.table(this.tableName).where({ id, deletedAt: null })
            .select(select || SELECT_FIELDS[this.tableName] || '*')
        return data;
    }

    // find one document
    public async findOneByQuery(query: Partial<TDoc>, select?: string[]) {
        const [data] = <TDoc[]>await this.knexModel.table(this.tableName).where({ ...query, deletedAt: null })
            .select(select || SELECT_FIELDS[this.tableName] || '*')
        return data;
    }

    // update one document
    protected async updateById(id: number, updateDataDto: Partial<TDoc>) {
        await this.knexModel.table(this.tableName).update(updateDataDto).where({ id });

        const data = await this.findOneById(id);
        return data;
    }

    // update one document by query
    protected async updateByQuery(query: Partial<TDoc>, updateDataDto: Partial<TDoc>) {
        await this.knexModel.table(this.tableName).update(updateDataDto).where(query);

        const data = await this.findByQuery(query);
        return data;
    }

    // delete one by id
    protected async removeById(id: number) {
        const updated = await this.knexModel.table(this.tableName).update({ deletedAt: new Date() }).where({ id }).andWhere('deletedAt', null);

        if (!updated) {
            return false;
        }
        const [data] = await this.knexModel.table(this.tableName).where({ id });
        return data;
    }

    // delete by query
    protected async removeByQuery(query: Partial<TDoc>) {
        const updated = await this.knexModel.table(this.tableName).update({ deletedAt: new Date() }).where(query).andWhere('deletedAt', null);

        if (!updated) {
            return false;
        }
        const data = await this.knexModel.table(this.tableName).where(query);
        return data;
    }

    // perform one to one relationship
    protected async OneToOne(primaryData: any | any[], localField: string, foreignTable: string, foreignField: string, includeAs: string, select?: string[]) {
        if (Array.isArray(primaryData) && !primaryData.length) {
            return primaryData;
        } else if (!Array.isArray(primaryData) && !primaryData[localField]) {
            return primaryData;
        }

        const primaryIds = Array.isArray(primaryData) ? primaryData.map(data => data[localField]) : [primaryData[localField]];

        const secondaryData = await this.knexModel.table(foreignTable).whereIn(foreignField, primaryIds).andWhere('deletedAt', null).select(select || SELECT_FIELDS[foreignTable] || '*');
        const secondaryDataMap = new Map(secondaryData.map(secondary => [secondary[foreignField], secondary]));

        if (Array.isArray(primaryData)) {
            return primaryData.map(primary => {
                const secondary = secondaryDataMap.get(primary[localField]);

                return {
                    ...primary,
                    [includeAs]: secondary || null
                }
            });
        }

        return {
            ...primaryData,
            [includeAs]: secondaryDataMap.get(primaryData[localField])
        }
    }


    // perform one to many relationship
    protected async OneToMany(primaryData: any | any[], localField: string, foreignTable: string, foreignField: string, includeAs: string, select?: string[]) {
        if (Array.isArray(primaryData) && !primaryData.length) {
            return primaryData;
        } else if (!Array.isArray(primaryData) && !primaryData[localField]) {
            return primaryData;
        }

        const primaryIds = Array.isArray(primaryData) ? primaryData.map(data => data.id) : [primaryData[localField]];
        const secondaryData = await this.knexModel.table(foreignTable).whereIn(foreignField, primaryIds).andWhere('deletedAt', null).select(select || SELECT_FIELDS[foreignTable] || '*');
        const secondaryDataMap = new Map();

        secondaryData.map(secondary => {
            // [secondary[foreignField], secondary]
            const isExist = secondaryDataMap.get(secondary[foreignField]);
            if (!isExist) {
                secondaryDataMap.set(secondary[foreignField], [secondary]);
            } else {
                isExist.push(secondary)
                secondaryDataMap.set(secondary[foreignField], isExist);
            }
        });

        if (Array.isArray(primaryData)) {
            return primaryData.map(primary => {
                const secondary = secondaryDataMap.get(primary[localField]);

                return {
                    ...primary,
                    [includeAs]: secondary || []
                }
            });
        }

        return {
            ...primaryData,
            [includeAs]: secondaryDataMap.get(primaryData[localField])
        }
    }

    protected bindFromArrToArr(primaryData: any[], secondaryData: any[], localField: string, foreignField: string, includeAs: string) {
        const secondaryDataMap = new Map();

        secondaryData.map(secondary => {
            // [secondary[foreignField], secondary]
            const isExist = secondaryDataMap.get(secondary[foreignField]);
            if (!isExist) {
                secondaryDataMap.set(secondary[foreignField], [secondary]);
            } else {
                isExist.push(secondary)
                secondaryDataMap.set(secondary[foreignField], isExist);
            }
        });

        return primaryData.map(primary => {
            const secondary = secondaryDataMap.get(primary[localField]);

            return {
                ...primary,
                [includeAs]: secondary || []
            }
        });
    }

    // log for create
    async logForCreate(userId: number, oldData: any, newData: any) {
        try {
            await this.knexModel.table(DB_TABLES.LOG).insert({
                tableName: this.tableName,
                recordId: newData.id,
                operation: 'create',
                oldData,
                newData,
                userId: userId,
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    // create log for update
    async logForUpdate(userId: number, oldData: any, newData: any) {
        try {
            await this.knexModel.table(DB_TABLES.LOG).insert({
                tableName: this.tableName,
                recordId: newData.id,
                operation: 'update',
                oldData,
                newData,
                userId: userId,
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    // log for delete
    async logForDelete(userId: number, oldData: any, newData: any) {
        try {
            await this.knexModel.table(DB_TABLES.LOG).insert({
                tableName: this.tableName,
                recordId: newData.id,
                operation: 'delete',
                oldData,
                newData,
                userId: userId,
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    // generate pagination
    protected pagination({ page = this.DEFAULT_PAGE, limit = this.DEFAULT_LIMIT }: IPaginate) {
        limit = limit && limit > 0 ? +limit : 10;
        page = page && page > 0 ? +page - 1 : 0;

        return {
            skip: page * limit,
            limit,
            page
        }
    }

    // return paginate response
    protected paginateResponse<Doc>({
        limit,
        page,
        total,
        data
    }: {
        data?: Doc[],
        limit: number,
        page: number,
        total: number,
    }) {
        const pagination = {
            limit: limit,
            page: page + 1,
            totalPage: total && Math.ceil(total / limit),
            totalResult: total,
        };
        return {
            pagination,
            data
        };
    }

    // generate slug from string
    protected generateSlug(str: string) {
        return str
            .toString()
            .normalize('NFD') // split an accented letter in the base letter and the acent
            .replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9 ]/g, '') // remove all chars not letters, numbers and spaces (to be replaced)
            .replace(/\s+/g, '-');
    };

    // generate random number with length
    protected generateRandomNumber(length: number) {
        return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
    }

    // generate transaction id
    protected generateTransactionId(id: number): string {
        const randomPart1 = Math.random().toString(36).substring(2, 8).toUpperCase();
        const randomPart2 = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `TXN${randomPart1}${id}${randomPart2}`;
    }

    // Function to convert a number to Base62
    protected toBase62(num: number): string {
        const BASE62_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let result = '';
        do {
            result = BASE62_CHARS[num % 62] + result;
            num = Math.floor(num / 62);
        } while (num > 0);
        return result;
    }

    // Function to generate a unique reference number
    protected generateReferenceNo(prefix: string): string {
        const timestamp = Date.now();
        const randomPart = crypto.randomBytes(4).readUInt32BE(0);
        return prefix + '_' + this.toBase62(timestamp) + this.toBase62(randomPart);
    }
}