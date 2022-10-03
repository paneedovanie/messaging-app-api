import { EntityRepository } from '@mikro-orm/mongodb';
import { Online } from '../../../entities/online.entity';

export class OnlineRepository extends EntityRepository<Online> {}
