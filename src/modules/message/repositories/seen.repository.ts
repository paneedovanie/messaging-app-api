import { EntityRepository } from '@mikro-orm/mongodb';
import { Seen } from '../../../entities';

export class SeenRepository extends EntityRepository<Seen> {}
