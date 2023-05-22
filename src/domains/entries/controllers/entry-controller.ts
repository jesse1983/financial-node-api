import { Connector } from '../../../entities';
import { RouteParams } from '../../../use-cases/route-params';
import { EntryRepository } from '../repositories';
import { EntryUseCase } from '../use-cases';

export class EntryController {
  private iEntryUseCase: EntryUseCase;

  constructor(connector: Connector) {
    const entryRepository = new EntryRepository(connector);
    this.iEntryUseCase = new EntryUseCase(entryRepository);
  }

  async getAll({ req, res, next }: RouteParams) {
    const { offset, limit } = req.query;
    const skip = offset ? Number.parseInt(String(offset)) : 0;
    const take = limit ? Number.parseInt(String(limit)) : 20;
    const date = req.query.date ? String(req.query.date) : '';

    try {
      const result = await this.iEntryUseCase.getAll({ skip, take, date });
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async getOne({ req, res, next }: RouteParams) {
    const id = req.params.id;

    try {
      const result = await this.iEntryUseCase.getOne(Number.parseInt(id));
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async create({ req, res, next }: RouteParams) {
    const entry = req.body;

    try {
      const created = await this.iEntryUseCase.create(entry);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  }
}
