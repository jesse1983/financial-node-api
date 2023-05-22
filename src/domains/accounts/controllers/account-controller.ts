import { Connector } from '../../../entities';
import { RouteParams } from '../../../use-cases/route-params';
import { AccountRepository } from '../repositories';
import { AccountUseCase } from '../use-cases';

export class AccountController {
  private iAccountUseCase: AccountUseCase;

  constructor(connector: Connector) {
    const entryRepository = new AccountRepository(connector);
    this.iAccountUseCase = new AccountUseCase(entryRepository);
  }

  async getAll({ req, res, next }: RouteParams) {
    const { offset, limit } = req.query;
    const skip = offset ? Number.parseInt(String(offset)) : 0;
    const take = limit ? Number.parseInt(String(limit)) : 20;

    try {
      const result = await this.iAccountUseCase.getAll({ skip, take });
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async getOne({ req, res, next }: RouteParams) {
    const id = req.params.id;

    try {
      const result = await this.iAccountUseCase.getOne(Number.parseInt(id));
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async create({ req, res }: RouteParams) {
    const entry = req.body;

    const created = await this.iAccountUseCase.create(entry);
    res.status(201).json(created);
  }

  async dailyReport({ req, res }: RouteParams) {
    const id = req.params.id;
    const day = req.params.day;

    const report = await this.iAccountUseCase.dailyReport(
      Number.parseInt(id),
      day
    );
    res.json(report);
  }
}
